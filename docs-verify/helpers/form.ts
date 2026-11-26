import type { Locator } from '@playwright/test';

/**
 * h3-kit form rows (`Field`): a `.h3-form-field-row` holding a
 * `.h3-form-field-label` and a `.h3-form-field-control`. The label is not
 * tied to the control (no htmlFor / id), so the control is reached through
 * the row whose label text matches exactly.
 */
export function fieldRow(scope: Locator, label: string): Locator {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return scope.locator('.h3-form-field-row').filter({
        has: scope.page().locator('.h3-form-field-label', { hasText: new RegExp(`^${escaped}$`) }),
    }).first();
}

/** The `<input>` / `<select>` / `<textarea>` inside a labelled row. */
export function fieldControl(scope: Locator, label: string): Locator {
    return fieldRow(scope, label)
        .locator('.h3-form-field-control')
        .locator('input, select, textarea')
        .first();
}

/**
 * Tick a labelled checkbox row (`CheckboxField`). Clicking the label text
 * does nothing because the label is not tied to the control, so the
 * Blueprint checkbox inside the row is clicked instead.
 */
export async function checkField(scope: Locator, label: string): Promise<void> {
    const box = fieldRow(scope, label).locator('.h3-form-checkbox');
    const input = box.locator('input[type="checkbox"]');
    if (!(await input.isChecked())) await box.click();
}

/**
 * Turn a labelled switch row (`SwitchField`) on or off. The input under the
 * Blueprint switch does not take clicks, so the switch itself is clicked.
 */
export async function setSwitchField(scope: Locator, label: string, on: boolean): Promise<void> {
    const row = fieldRow(scope, label);
    const input = row.locator('input[type="checkbox"]').first();
    if ((await input.isChecked()) !== on) await row.locator('.h3-form-switch').first().click();
    if ((await input.isChecked()) !== on) throw new Error(`[docs-verify] switch "${label}" did not turn ${on ? 'on' : 'off'}`);
}
