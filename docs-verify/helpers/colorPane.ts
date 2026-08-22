import { expect, type Page } from '@playwright/test';

/**
 * Explorer > Color pane. The renderer selector is an HTMLSelect whose
 * options read "name (type)" grouped per object; the coloring type opens
 * from the caret button next to it as a Blueprint menu.
 */

export async function selectColorTarget(window: Page, optionLabel: string): Promise<void> {
    await window.locator('.color-enum-select select, select.color-enum-select').first()
        .selectOption({ label: optionLabel });
}

export async function chooseColoring(window: Page, itemLabel: string): Promise<void> {
    await window.getByRole('button', { name: 'Coloring', exact: true }).click();
    const menu = window.locator('.bp5-menu');
    await expect(menu).toBeVisible();
    await menu.getByText(itemLabel, { exact: true }).click();
    await menu.waitFor({ state: 'detached' });
}
