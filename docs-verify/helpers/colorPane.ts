import { expect, type Page } from '@playwright/test';
import type { ElectronApplication } from 'playwright';
import { pickNextPopupItem } from './popupMenu';

/**
 * Explorer > Color pane. The renderer selector is an HTMLSelect whose
 * options read "name (type)" grouped per object; the coloring type opens
 * from the button next to it (title "Coloring mode", text = the current
 * mode) as the platform menu, which the popup-menu stub answers.
 */

export async function selectColorTarget(window: Page, optionLabel: string): Promise<void> {
    await window.locator('.color-enum-select select, select.color-enum-select').first()
        .selectOption({ label: optionLabel });
}

/** The coloring-type button next to the target selector. */
export function coloringButton(window: Page) {
    return window.locator('.color-shell-row').getByTitle('Coloring mode');
}

/**
 * Pick a coloring type, e.g. ['Rainbow coloring'] or
 * ['Paint coloring', 'Okabe-Ito', 'Sky blue'] (submenu path).
 */
export async function chooseColoring(
    app: ElectronApplication,
    window: Page,
    path: string[],
): Promise<void> {
    await pickNextPopupItem(app, path);
    await coloringButton(window).click();
    await expect(coloringButton(window)).toBeEnabled();
}
