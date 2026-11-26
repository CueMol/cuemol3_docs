import { expect, type Locator, type Page } from '@playwright/test';
import { openSidebarView } from './sidebar';

/**
 * Crystal > Density map pane. The renderer is an HTMLSelect at the top; the
 * unit menu opens from the button "Level mode" (a Blueprint popover); Level
 * is a bare number input (`input.h3-form-numeric`); Transp / Extent are
 * drag rows like the View pane's.
 */

export async function densityPane(window: Page): Promise<Locator> {
    await openSidebarView(window, 'crystal');
    const pane = window.locator('.sp-pane').filter({ has: window.getByRole('button', { name: 'Level mode' }) }).first();
    await expect(pane).toBeVisible();
    return pane;
}

export async function selectMapRenderer(pane: Locator, label: string): Promise<void> {
    const select = pane.locator('.denmap-row select').first();
    const v = await select.locator('option').filter({ hasText: label }).first().getAttribute('value');
    if (v === null) throw new Error(`no map renderer ${label}`);
    await select.selectOption(v);
}

export function levelInput(pane: Locator): Locator {
    return pane.locator('input.h3-form-numeric').first();
}

/** Type a level and commit it (Enter), then wait for the field to show it. */
export async function setLevel(pane: Locator, value: number): Promise<void> {
    const input = levelInput(pane);
    await input.fill(String(value));
    await input.press('Enter');
    await expect.poll(async () => Number(await input.inputValue())).toBeCloseTo(value, 2);
}

/** A drag row (Transp / Extent): click the value, type, Enter. */
export async function setDragRow(pane: Locator, label: string, value: number): Promise<void> {
    const row = pane.locator('.h3-form-grid-row')
        .filter({ has: pane.page().locator('.h3-form-grid-label', { hasText: new RegExp(`^${label}$`) }) })
        .first();
    await row.locator('.h3-form-drag').click();
    const input = row.locator('input.h3-form-drag-input');
    await input.fill(String(value));
    await input.press('Enter');
}
