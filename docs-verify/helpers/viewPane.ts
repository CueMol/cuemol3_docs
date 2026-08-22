import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Explorer > View pane (numeric viewpoint control). Its rows are
 * FieldGridRows whose only hook is the sibling label, and the fields are
 * DragNumericFields that turn into a number input on a click that does not
 * cross the drag threshold. Recorded as an upstream aria-label candidate.
 *
 * Rotation (RotX/RotY/RotZ) is a RELATIVE dial: the value snaps back to 0
 * after each edit, so only the absolute rows (Translation, Zoom, Slab,
 * Dist) can be asserted by reading the value back.
 */

function viewRow(window: Page, label: string): Locator {
    return window
        .locator('.view-pane .h3-form-grid-row')
        .filter({ has: window.locator('.h3-form-grid-label', { hasText: new RegExp(`^${label}$`) }) });
}

/** Set an absolute View-pane value (Zoom / Slab / Dist / TraX...) and verify it. */
export async function setViewValue(window: Page, label: string, value: number): Promise<void> {
    const row = viewRow(window, label);
    await row.locator('.h3-form-drag').click();
    const input = row.locator('input.h3-form-drag-input');
    await input.fill(String(value));
    await input.press('Enter');
    await expect(row.locator('.h3-form-drag-value')).toContainText(String(value));
}

/** The value as displayed, e.g. "30A" (number plus unit, no separator). */
export async function viewValueText(window: Page, label: string): Promise<string> {
    return (await viewRow(window, label).locator('.h3-form-drag-value').innerText()).trim();
}

/**
 * The label and the field, for documentation screenshots. The row wrapper
 * itself is `display: contents` (a CSS-grid pass-through), so it has no box
 * of its own and cannot be captured directly.
 */
export function viewPaneRowParts(window: Page, label: string): Locator[] {
    const row = viewRow(window, label);
    return [row.locator('.h3-form-grid-label'), row.locator('.h3-form-grid-control')];
}
