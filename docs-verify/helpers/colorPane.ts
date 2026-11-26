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

/**
 * Select a renderer of one object: options are grouped per object
 * (`<optgroup label=objName>`), and two objects can both have "cartoon1".
 */
export async function selectColorTargetOf(window: Page, objName: string, optionLabel: string): Promise<void> {
    const select = window.locator('.color-enum-select select, select.color-enum-select').first();
    const value = await select.locator(`optgroup[label="${objName}"] option`)
        .filter({ hasText: optionLabel }).first().getAttribute('value');
    if (value === null) throw new Error(`no "${optionLabel}" under ${objName} in the Color pane`);
    await select.selectOption(value);
}

/**
 * Paint deck: add a row at the top of the table and set its selection and
 * colour, as the pages describe ("表の一番上に行を追加し、選択式に ...、色に
 * ... を指定します"). Add inserts before the selected row, so the first row
 * is selected first; a new row copies that row, and its two cells are then
 * edited in place (double-click opens the editor, Enter commits).
 */
export async function addPaintRowAtTop(window: Page, selection: string, color: string): Promise<void> {
    const rows = window.locator('.color-row');
    await rows.first().click();
    const before = await rows.count();
    await window.getByRole('button', { name: 'Add row' }).click();
    await expect(rows).toHaveCount(before + 1);

    const top = rows.first();
    await top.locator('.color-cell-selection').dblclick();
    const selInput = top.locator('.color-cell-selection input').first();
    await selInput.fill(selection);
    await selInput.press('Enter');
    await expect(top.locator('.color-cell-selection')).toContainText(selection);

    await top.locator('.color-cell-color').dblclick();
    const colorInput = top.locator('.color-cell-color input').first();
    await colorInput.fill(color);
    // Enter blurs the text box, which compiles and commits the colour; the
    // editor stays open, so Escape hands the cell back to its display state.
    await colorInput.press('Enter');
    await colorInput.press('Escape').catch(() => {});
    await expect(top.locator('.color-cell-color')).toContainText(new RegExp(color.replace('#', ''), 'i'));
}

/** The Explorer > Color pane (the one with the Coloring mode button). */
export function colorPane(window: Page) {
    return window.locator('.sp-pane').filter({ has: window.getByTitle('Coloring mode') }).first();
}

/** Paint table row whose selection cell reads exactly `selection`. */
export function paintRow(window: Page, selection: string) {
    const escaped = selection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return window.locator('.color-row').filter({
        has: window.locator('.color-cell-selection', { hasText: new RegExp(`^\\s*${escaped}\\s*$`) }),
    }).first();
}

/** Click a Paint table toolbar button on a row ("Move row up", "Delete row", ...). */
export async function paintRowAction(window: Page, selection: string, action: 'Move row up' | 'Move row down' | 'Delete row'): Promise<void> {
    await paintRow(window, selection).click();
    await window.getByRole('button', { name: action }).click();
    // The button's tooltip stays over the table while the pointer rests on
    // it and would take the next click; move the pointer away.
    await window.mouse.move(1, 1);
    await expect(window.locator('.bp5-popover-content', { hasText: action.replace(' row', '') })).toHaveCount(0);
}

/** Edit the colour cell of a Paint row (double-click, type, Enter, Escape). */
export async function setPaintRowColor(window: Page, selection: string, color: string): Promise<void> {
    const row = paintRow(window, selection);
    await row.locator('.color-cell-color').dblclick();
    const input = row.locator('.color-cell-color input').first();
    await input.fill(color);
    await input.press('Enter');
    await input.press('Escape').catch(() => {});
    await expect(row.locator('.color-cell-color')).toContainText(new RegExp(color.replace('#', ''), 'i'));
}

/** The selection cells of the Paint table, top to bottom. */
export async function paintSelections(window: Page): Promise<string[]> {
    return (await window.locator('.color-row .color-cell-selection').allInnerTexts()).map((t) => t.trim());
}
