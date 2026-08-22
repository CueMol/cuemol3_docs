import { expect, type Page } from '@playwright/test';

/**
 * Molecular-view (canvas) gestures. There is no render-complete signal for
 * plain viewpoint changes, so gestures settle on a single fixed wait; the
 * checks around them assert only that the app keeps responding.
 */
export const VIEW_SETTLE_MS = 300;

function canvas(window: Page) {
    return window.locator('canvas').first();
}

export async function rotateView(window: Page, dx = 120, dy = 60): Promise<void> {
    const box = await canvas(window).boundingBox();
    if (!box) throw new Error('[docs-verify] molecular view canvas not found');
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await window.mouse.move(cx, cy);
    await window.mouse.down();
    for (let i = 1; i <= 6; i++) {
        await window.mouse.move(cx + (dx * i) / 6, cy + (dy * i) / 6);
    }
    await window.mouse.up();
    await window.waitForTimeout(VIEW_SETTLE_MS);
}

/**
 * Click an atom near the middle of the view (the molecule is centred after
 * loading) and wait for the app to report the hit. Which atom is hit depends
 * on the viewpoint, so a few nearby points are tried before giving up; the
 * point that hit is returned so a screenshot can be framed around it.
 *
 * The report goes to the status bar and the Output panel, not to the main
 * process log.
 */
const PICK_OFFSETS = [[0, 0], [12, 8], [-14, 6], [8, -16], [-20, -12]] as const;

export async function clickAtomNearCenter(
    window: Page,
    objectName: string,
): Promise<{ x: number; y: number }> {
    const box = await canvas(window).boundingBox();
    if (!box) throw new Error('[docs-verify] molecular view canvas not found');
    const status = window.locator('.status-left');
    for (const [dx, dy] of PICK_OFFSETS) {
        const x = Math.round(box.x + box.width / 2 + dx);
        const y = Math.round(box.y + box.height / 2 + dy);
        await window.mouse.click(x, y);
        try {
            await expect(status).toContainText(`Molecule [${objectName}]`, { timeout: 2_000 });
            return { x, y };
        } catch {
            // Missed: the click landed between atoms. Try the next point.
        }
    }
    const seen = await status.innerText().catch(() => '(status bar empty)');
    throw new Error(
        `[docs-verify] no atom of "${objectName}" was hit near the view centre\n` +
        `  canvas: ${JSON.stringify(box)}\n  status bar: ${JSON.stringify(seen)}`,
    );
}

export async function zoomView(window: Page, wheelDelta = -240): Promise<void> {
    const box = await canvas(window).boundingBox();
    if (!box) throw new Error('[docs-verify] molecular view canvas not found');
    await window.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await window.mouse.wheel(0, wheelDelta);
    await window.waitForTimeout(VIEW_SETTLE_MS);
}
