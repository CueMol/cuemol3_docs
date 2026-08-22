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
 */

const DOCS_IMAGES_DIR = path.join(__dirname, '..', '..', 'docs', 'assets', 'images');
const TARGET_WIDTH = 1280;
const MAX_BYTES = 300 * 1024;
// Fixed settle before capture: the GL canvas redraws asynchronously after the
// UI action that precedes the shot. Only runs in DOCSHOT mode, so it does not
// slow down the verification suite (which owns VIEW_SETTLE_MS separately).
const SHOT_SETTLE_MS = 500;
const WEBP_QUALITIES = [82, 70, 58, 46];

export async function docShot(
    window: Page,
    id: string,
    opts: { clip?: Locator | Locator[]; pad?: number } = {},
): Promise<void> {
    if (!process.env.DOCSHOT) return;

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

    const file = path.join(DOCS_IMAGES_DIR, `${id}.webp`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, out);
    console.log(`[docShot] ${id}.webp (${Math.round(out.length / 1024)} KB)`);
}

async function capture(window: Page, opts: { clip?: Locator | Locator[]; pad?: number }): Promise<Buffer> {
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
