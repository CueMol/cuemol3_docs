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
 * ## Show a widget in its surroundings
 *
 * A crop of one widget (a row, a button, a selector) does not tell the
 * reader where in the window it is. For those, pass the widget as
 * opts.highlight and a larger area as opts.clip (the side panel column, the
 * toolbar, or `aroundBox()` for a margin around the widget): the capture
 * covers the area and a frame is drawn around the widget. Whole dialogs and
 * menus are self-explanatory and are still clipped on their own.
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

export interface ShotOptions {
    /** Area to capture: one element, or the bounding box of several. */
    clip?: Locator | Locator[];
    /** Margin around the clip box, in CSS pixels. */
    pad?: number;
    /** An explicit area, for parts of the GL canvas that no element covers. */
    rect?: Rect;
    /** Widgets the text points at; framed in the capture. */
    highlight?: Locator | Locator[];
}

/** Frame colour: Okabe-Ito vermillion, visible on the dark UI and on white. */
const HIGHLIGHT_COLOR = '#D55E00';
const HIGHLIGHT_ID = 'docshot-highlight';

/**
 * The area within `margin` CSS pixels of the widgets (clamped to the
 * window), for a widget that has no natural container to show it in.
 */
export async function aroundBox(window: Page, targets: Locator | Locator[], margin = 120): Promise<Rect> {
    const boxes = await boxesOf(Array.isArray(targets) ? targets : [targets]);
    const vp = await viewport(window);
    const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - margin);
    const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - margin);
    const x2 = Math.min(vp.w, Math.max(...boxes.map((b) => b.x + b.width)) + margin);
    const y2 = Math.min(vp.h, Math.max(...boxes.map((b) => b.y + b.height)) + margin);
    return { x, y, width: x2 - x, height: y2 - y };
}

/**
 * The left column (activity bar + side panel) from its top down to just
 * below the widgets, so a pane row is shown inside the panel it lives in.
 */
export async function sidebarRect(window: Page, targets: Locator | Locator[], below = 80): Promise<Rect> {
    const boxes = await boxesOf(Array.isArray(targets) ? targets : [targets]);
    const panel = await window.locator('.side-panel').first().boundingBox();
    const bar = await window.locator('.activity-bar').first().boundingBox();
    if (!panel) throw new Error('[docShot] side panel not visible');
    const vp = await viewport(window);
    const x = bar ? Math.min(bar.x, panel.x) : panel.x;
    const y = panel.y;
    const x2 = panel.x + panel.width;
    const y2 = Math.min(vp.h, Math.max(...boxes.map((b) => b.y + b.height)) + below);
    return { x, y, width: x2 - x, height: y2 - y };
}

/**
 * The property inspector column (right side) from its header down to just
 * below the widgets.
 */
export async function inspectorRect(window: Page, targets: Locator | Locator[], below = 80): Promise<Rect> {
    const boxes = await boxesOf(Array.isArray(targets) ? targets : [targets]);
    const bar = await window.locator('.inspector-mode-bar').first().boundingBox();
    if (!bar) throw new Error('[docShot] inspector not visible');
    const vp = await viewport(window);
    const x = Math.max(0, bar.x - 16);
    // The header row (kind / name / close) sits above the mode bar.
    const y = Math.max(0, bar.y - 44);
    const y2 = Math.min(vp.h, Math.max(...boxes.map((b) => b.y + b.height)) + below);
    return { x, y, width: vp.w - x, height: y2 - y };
}

/**
 * The toolbar from the window's left edge to a little past the button, so
 * the button is shown among its neighbours.
 */
export async function toolbarRect(window: Page, button: Locator, right = 200): Promise<Rect> {
    const [b] = await boxesOf([button]);
    const bar = await window.locator('.app-toolbar').first().boundingBox();
    if (!bar) throw new Error('[docShot] toolbar not visible');
    const vp = await viewport(window);
    return { x: 0, y: bar.y, width: Math.min(vp.w, b.x + b.width + right), height: bar.height };
}

async function boxesOf(locs: Locator[]): Promise<Rect[]> {
    const boxes: Rect[] = [];
    for (const c of locs) {
        // A pane can be scrolled out of view at the shot window size.
        await c.scrollIntoViewIfNeeded().catch(() => {});
        const b = await c.boundingBox();
        if (b) boxes.push(b);
    }
    if (!boxes.length) throw new Error('[docShot] no visible clip target');
    return boxes;
}

async function viewport(window: Page): Promise<{ w: number; h: number }> {
    // "window" here is the Page; the browser globals come via globalThis.
    return window.evaluate(() => ({
        w: (globalThis as any).innerWidth as number,
        h: (globalThis as any).innerHeight as number,
    }));
}

/** Frame stroke plus the gap between frame and widget, in CSS pixels. */
const FRAME_OUTSET = 4;
const FRAME_STROKE = 3;
/** Space kept around a frame so its rounded stroke is never cut. */
const FRAME_MARGIN = 10;

/** The frame rectangle for a widget box, pulled inside the window. */
function frameRect(b: Rect, vp: { w: number; h: number }): Rect {
    const inset = 1;
    const x = Math.max(inset, b.x - FRAME_OUTSET);
    const y = Math.max(inset, b.y - FRAME_OUTSET);
    const x2 = Math.min(vp.w - inset, b.x + b.width + FRAME_OUTSET);
    const y2 = Math.min(vp.h - inset, b.y + b.height + FRAME_OUTSET);
    return { x, y, width: x2 - x, height: y2 - y };
}

/**
 * Grow the capture area so every highlight frame fits in it with a margin:
 * a frame cut by the crop edge looks like a broken shape.
 */
async function withFrames(window: Page, opts: ShotOptions): Promise<ShotOptions> {
    if (!opts.highlight) return opts;
    if (!opts.rect && !opts.clip) return opts; // full window
    const vp = await viewport(window);
    const frames = (await boxesOf(Array.isArray(opts.highlight) ? opts.highlight : [opts.highlight]))
        .map((b) => frameRect(b, vp));
    let area: Rect;
    if (opts.rect) {
        area = opts.rect;
    } else {
        const clips = Array.isArray(opts.clip) ? opts.clip! : [opts.clip!];
        const boxes = await boxesOf(clips);
        const pad = opts.pad ?? 8;
        const x = Math.min(...boxes.map((b) => b.x)) - pad;
        const y = Math.min(...boxes.map((b) => b.y)) - pad;
        area = {
            x, y,
            width: Math.max(...boxes.map((b) => b.x + b.width)) + pad - x,
            height: Math.max(...boxes.map((b) => b.y + b.height)) + pad - y,
        };
    }
    let x = Math.min(area.x, ...frames.map((f) => f.x - FRAME_MARGIN));
    let y = Math.min(area.y, ...frames.map((f) => f.y - FRAME_MARGIN));
    let x2 = Math.max(area.x + area.width, ...frames.map((f) => f.x + f.width + FRAME_MARGIN));
    let y2 = Math.max(area.y + area.height, ...frames.map((f) => f.y + f.height + FRAME_MARGIN));
    x = Math.max(0, x); y = Math.max(0, y);
    x2 = Math.min(vp.w, x2); y2 = Math.min(vp.h, y2);
    return { rect: { x, y, width: x2 - x, height: y2 - y } };
}

/** Overlay one frame per widget (fixed position, so layout is untouched). */
async function drawHighlight(window: Page, targets: Locator | Locator[]): Promise<number> {
    const vp = await viewport(window);
    const boxes = (await boxesOf(Array.isArray(targets) ? targets : [targets])).map((b) => frameRect(b, vp));
    await window.evaluate(({ boxes, color, id, stroke }) => {
        const doc = (globalThis as any).document;
        for (const b of boxes) {
            const el = doc.createElement('div');
            el.className = id;
            el.style.cssText =
                `position:fixed;left:${b.x}px;top:${b.y}px;` +
                `width:${b.width}px;height:${b.height}px;` +
                `border:${stroke}px solid ${color};border-radius:6px;box-sizing:border-box;` +
                'pointer-events:none;z-index:2147483647;';
            doc.body.appendChild(el);
        }
    }, { boxes, color: HIGHLIGHT_COLOR, id: HIGHLIGHT_ID, stroke: FRAME_STROKE });
    return boxes.length;
}

async function clearHighlight(window: Page): Promise<void> {
    await window.evaluate((id) => {
        const doc = (globalThis as any).document;
        for (const el of Array.from(doc.querySelectorAll(`.${id}`)) as any[]) el.remove();
    }, HIGHLIGHT_ID).catch(() => {});
}

export async function docShot(
    window: Page,
    id: string,
    opts: ShotOptions = {},
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

    // Park the pointer in the window's top-left corner so no tooltip or
    // hover highlight from the last click ends up in the picture.
    await window.mouse.move(1, 1).catch(() => {});
    await window.waitForTimeout(SHOT_SETTLE_MS);
    const frames = opts.highlight ? await drawHighlight(window, opts.highlight) : 0;
    let png: Buffer;
    try {
        png = await capture(window, await withFrames(window, opts));
    } finally {
        if (frames) await clearHighlight(window);
    }

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

async function capture(window: Page, opts: ShotOptions): Promise<Buffer> {
    // An explicit region, for parts of the GL canvas that no element covers.
    if (opts.rect) return window.screenshot({ clip: opts.rect });
    if (!opts.clip) return window.screenshot();
    const clips = Array.isArray(opts.clip) ? opts.clip : [opts.clip];
    if (clips.length === 1 && opts.pad === undefined) return clips[0].screenshot();

    const boxes = await boxesOf(clips);
    const pad = opts.pad ?? 8;
    const vp = await viewport(window);
    const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
    const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
    const x2 = Math.min(vp.w, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
    const y2 = Math.min(vp.h, Math.max(...boxes.map((b) => b.y + b.height)) + pad);
    return window.screenshot({ clip: { x, y, width: x2 - x, height: y2 - y } });
}
