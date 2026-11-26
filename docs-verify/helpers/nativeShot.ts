import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { expect, type ElectronApplication, type Page } from '@playwright/test';
import { closeNativeMenu, nativeMenuShown, showNextNativeMenu } from './popupMenu';
import { mayWriteShot, writeShot } from './docShot';

/**
 * Screenshots of native context menus (macOS NSMenu), which are drawn by
 * the OS outside the page and so cannot be captured by Playwright. The real
 * menu is opened once through the context-menu driver, and the screen is
 * captured with `screencapture`, which needs the Screen Recording permission
 * for the terminal that runs the tests.
 *
 * The menu's rectangle is found by comparing a capture taken just before the
 * menu opens with one taken while it is open; the shot is that rectangle
 * plus `margin` points of the window around it.
 */

interface ScreenRect { x: number; y: number; width: number; height: number }

/** The main window's content area in screen points, after raising it. */
async function contentBounds(app: ElectronApplication, page: Page): Promise<ScreenRect> {
    const title = await page.title();
    return app.evaluate(({ BrowserWindow, app: eapp }, t) => {
        // Electron types are not installed here, hence the anys.
        const wins: any[] = BrowserWindow.getAllWindows();
        const win = wins.find((w) => w.getTitle() === t && !w.webContents.getURL().includes('render.html')) ?? wins[0];
        eapp.focus({ steal: true });
        win.moveTop();
        win.focus();
        return win.getContentBounds();
    }, title);
}

function screencapture(r: ScreenRect, file: string): void {
    execFileSync('screencapture', ['-x', '-R', `${r.x},${r.y},${r.width},${r.height}`, file]);
}

/** Bounding box (in pixels) of the pixels that differ between two same-size RGBA images. */
function diffBox(a: Buffer, b: Buffer, w: number, h: number, ch: number): { x: number; y: number; x2: number; y2: number } | undefined {
    let x1 = w, y1 = h, x2 = -1, y2 = -1;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * ch;
            if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 24) {
                if (x < x1) x1 = x;
                if (y < y1) y1 = y;
                if (x > x2) x2 = x;
                if (y > y2) y2 = y;
            }
        }
    }
    return x2 < 0 ? undefined : { x: x1, y: y1, x2, y2 };
}

/**
 * Open the native context menu with `open` (a right-click), capture it with
 * `margin` points of its surroundings, close it and write the shot `id`.
 * A no-op unless DOCSHOT=1.
 */
export async function nativeMenuShot(
    app: ElectronApplication,
    page: Page,
    id: string,
    open: () => Promise<void>,
    margin = 40,
): Promise<void> {
    if (!process.env.DOCSHOT || !mayWriteShot(id)) return;
    const sharp = (await import('sharp')).default;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docshot-menu-'));
    const before = path.join(dir, 'before.png');
    const during = path.join(dir, 'during.png');
    const bounds = await contentBounds(app, page);
    await page.waitForTimeout(500);
    screencapture(bounds, before);
    await showNextNativeMenu(app);
    try {
        await open();
        await expect.poll(() => nativeMenuShown(app), { timeout: 5_000 }).toBe(true);
        // The menu fades in.
        await page.waitForTimeout(600);
        screencapture(bounds, during);
    } finally {
        await closeNativeMenu(app);
    }
    const a = await sharp(before).raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(during).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = b.info;
    if (a.info.width !== width || a.info.height !== height) throw new Error('[nativeMenuShot] capture sizes differ');
    const box = diffBox(a.data, b.data, width, height, channels);
    if (!box) throw new Error(`[nativeMenuShot] ${id}: the menu did not show in the capture (Screen Recording permission?)`);
    const scale = width / bounds.width;
    const m = Math.round(margin * scale);
    const left = Math.max(0, box.x - m);
    const top = Math.max(0, box.y - m);
    const right = Math.min(width, box.x2 + 1 + m);
    const bottom = Math.min(height, box.y2 + 1 + m);
    const png = await sharp(during)
        .extract({ left, top, width: right - left, height: bottom - top })
        .png().toBuffer();
    fs.rmSync(dir, { recursive: true, force: true });
    await writeShot(id, png);
}
