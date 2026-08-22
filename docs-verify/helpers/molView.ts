import type { Page } from '@playwright/test';

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

export async function zoomView(window: Page, wheelDelta = -240): Promise<void> {
    const box = await canvas(window).boundingBox();
    if (!box) throw new Error('[docs-verify] molecular view canvas not found');
    await window.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await window.mouse.wheel(0, wheelDelta);
    await window.waitForTimeout(VIEW_SETTLE_MS);
}
