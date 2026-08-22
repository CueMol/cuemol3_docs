import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { Locator, Page } from '@playwright/test';

/**
 * Documentation-screenshot pipeline. Specs call this at every point matching
 * a screenshot in the docs, so the capture order is woven into the scenarios.
 *
 * No-op unless DOCSHOT=1 (`task e2e:shots`), so the regular verification runs
 * never touch docs/. When enabled, the window is captured, downscaled to the
 * shot window's CSS width (the Retina capture is 2x device pixels) and
 * written as WebP under docs/assets/images/<id>.webp within the 300 KB image
 * budget enforced by `task check:images`. e2e:shots runs with
 * E2E_WINDOW=1280x800, so the images come out 1280 px wide.
 *
 * opts.clip crops the capture to one element (e.g. a dialog) or to the
 * bounding box of several (opts.pad adds margin around it). Clipped shots
 * stay in device pixels (2x on Retina), so the page can show them near their
 * natural size with a markdown width attribute and still be Retina-sharp.
 *
 * id convention: "<docs page slug>/<section>-<content>", e.g.
 * "getting-started/quick-tour/2-getpdb".
 *
 * ## Hand-made figures are never overwritten
 *
 * Some figures are better drawn than captured (annotations, before/after
 * montages, a framing a human chooses). To keep a run from clobbering them,
 * every write records the file's hash in docshot-manifest.json. A capture
 * overwrites an existing file only when its hash still matches that record,
 * i.e. only when the file is this pipeline's own untouched output. Anything
 * else -- a hand-made figure, or a generated one edited afterwards -- is left
 * alone and reported as SKIP.
 *
 * - DOCSHOT_FORCE=1 overwrites regardless (hand the figure back to the
 *   pipeline, or re-take one you edited by mistake).
 * - DOCSHOT_ADOPT=1 records the hashes of the files already on disk without
 *   capturing anything (used once to seed the manifest).
 */

const DOCS_IMAGES_DIR = path.join(__dirname, '..', '..', 'docs', 'assets', 'images');
const TARGET_WIDTH = 1280;
const MAX_BYTES = 300 * 1024;
// Fixed settle before capture: the GL canvas redraws asynchronously after the
// UI action that precedes the shot. Only runs in DOCSHOT mode, so it does not
// slow down the verification suite (which owns VIEW_SETTLE_MS separately).
const SHOT_SETTLE_MS = 500;
const WEBP_QUALITIES = [82, 70, 58, 46];

export interface Rect { x: number; y: number; width: number; height: number }

export async function docShot(
    window: Page,
    id: string,
    opts: { clip?: Locator | Locator[]; pad?: number; rect?: Rect } = {},
): Promise<void> {
    if (!process.env.DOCSHOT) return;

    const file = path.join(DOCS_IMAGES_DIR, `${id}.webp`);
    const existing = fs.existsSync(file) ? fs.readFileSync(file) : undefined;

    if (process.env.DOCSHOT_ADOPT) {
        if (existing) {
            recordHash(id, sha256(existing));
            console.log(`[docShot] adopt ${id}.webp`);
            return;
        }
    } else if (existing && !process.env.DOCSHOT_FORCE && !isOwnOutput(id, existing)) {
        console.log(
            `[docShot] SKIP ${id}.webp — hand-made or edited after generation; ` +
            'left as is (DOCSHOT_FORCE=1 to overwrite)',
        );
        return;
    }

    await window.waitForTimeout(SHOT_SETTLE_MS);
    const png = await capture(window, opts);

    // Lazy import keeps sharp (a native module) out of the normal test runs.
    const sharp = (await import('sharp')).default;
    const { width = 0 } = await sharp(png).metadata();

    let out: Buffer | undefined;
    for (const quality of WEBP_QUALITIES) {
        let img = sharp(png);
        // On Retina displays the capture is in device pixels (2x); downscale
        // to the shot window's CSS width. Smaller captures stay as-is.
        if (width > TARGET_WIDTH) img = img.resize({ width: TARGET_WIDTH });
        out = await img.webp({ quality }).toBuffer();
        if (out.length <= MAX_BYTES) break;
    }
    if (!out || out.length > MAX_BYTES) {
        throw new Error(`[docShot] ${id}: ${out?.length} bytes even at q=${WEBP_QUALITIES.at(-1)} (budget ${MAX_BYTES})`);
    }

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, out);
    recordHash(id, sha256(out));
    console.log(`[docShot] ${id}.webp (${Math.round(out.length / 1024)} KB)`);
}

/* --- provenance manifest --- */

const MANIFEST = path.join(__dirname, '..', 'docshot-manifest.json');

function sha256(buf: Buffer): string {
    return crypto.createHash('sha256').update(buf).digest('hex');
}

function readManifest(): Record<string, string> {
    try {
        return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Record<string, string>;
    } catch {
        return {};
    }
}

/** True when the file on disk is byte-identical to what this pipeline wrote. */
function isOwnOutput(id: string, current: Buffer): boolean {
    return readManifest()[id] === sha256(current);
}

function recordHash(id: string, hash: string): void {
    const manifest = readManifest();
    manifest[id] = hash;
    const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
}

async function capture(
    window: Page,
    opts: { clip?: Locator | Locator[]; pad?: number; rect?: Rect },
): Promise<Buffer> {
    // An explicit region, for parts of the GL canvas that no element covers.
    if (opts.rect) return window.screenshot({ clip: opts.rect });
    if (!opts.clip) return window.screenshot();
    const clips = Array.isArray(opts.clip) ? opts.clip : [opts.clip];
    if (clips.length === 1 && opts.pad === undefined) return clips[0].screenshot();

    const boxes = [];
    for (const c of clips) {
        // A pane can be scrolled out of view at the shot window size.
        await c.scrollIntoViewIfNeeded().catch(() => {});
        const b = await c.boundingBox();
        if (b) boxes.push(b);
    }
    if (!boxes.length) throw new Error('[docShot] no visible clip target');
    const pad = opts.pad ?? 8;
    // "window" here is the Page; the browser globals come via globalThis.
    const vp = await window.evaluate(() => ({
        w: (globalThis as any).innerWidth as number,
        h: (globalThis as any).innerHeight as number,
    }));
    const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
    const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
    const x2 = Math.min(vp.w, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
    const y2 = Math.min(vp.h, Math.max(...boxes.map((b) => b.y + b.height)) + pad);
    return window.screenshot({ clip: { x, y, width: x2 - x, height: y2 - y } });
}
