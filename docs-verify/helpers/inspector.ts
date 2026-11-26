import { expect, type Page } from '@playwright/test';

/**
 * Property-inspector helpers. Sections are accordions ("Basic settings",
 * "Edge lines", "Ball and stick", ...); numeric fields are h3-kit
 * DragNumericFields whose value display turns into a text input on a
 * single click and commits on Enter.
 */

/**
 * Set a numeric property inside an inspector section and verify the
 * committed value is displayed back (the docs' "即座に反映" behaviour at
 * the widget level).
 */
export async function setNumericProperty(
    window: Page,
    section: string,
    label: string,
    value: number,
): Promise<void> {
    const labelEl = window.getByText(label, { exact: true }).last();
    // The row exists only while its section is open; in a small window it
    // may be scrolled out of view, which must not be taken for "closed"
    // (clicking the header would then close the section).
    const header = window.getByText(section, { exact: true }).last();
    await header.waitFor({ state: 'visible', timeout: 10_000 });
    // The inspector may still be settling after the row was opened; open the
    // section (once per poll) until the row appears.
    await expect.poll(async () => {
        if ((await labelEl.count()) > 0) return true;
        await header.click();
        await window.waitForTimeout(300);
        return (await labelEl.count()) > 0;
    }, { timeout: 10_000 }).toBe(true);
    await labelEl.scrollIntoViewIfNeeded({ timeout: 5_000 });
    // Snapshot shape: row > (label + reset button) + (Decrement / value / Increment).
    const row = labelEl.locator('xpath=ancestor::*[2]');
    await row.getByRole('button', { name: 'Decrement' }).locator('xpath=following-sibling::*[1]').click();
    // The edit input is type="number" (ARIA spinbutton).
    const input = row.getByRole('spinbutton');
    await input.fill(String(value));
    await input.press('Enter');
    await expect(row).toContainText(String(value));
}
