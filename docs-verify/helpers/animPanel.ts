import { expect, type Locator, type Page } from '@playwright/test';
import { showBottomTab } from './bottomPanel';

/**
 * Animation panel (bottom panel tab "Animation", AnimationPanel.tsx). The
 * left column lists the elements (`.anim-label-row`, one per strip) above an
 * edit toolbar whose "Add element" button opens a Blueprint menu of the
 * element types; selecting a row shows the element in the inspector.
 */
export function animPanel(w: Page): Locator {
    return w.locator('.animation-panel').first();
}

export async function showAnimPanel(w: Page): Promise<Locator> {
    await showBottomTab(w, 'Animation');
    const panel = animPanel(w);
    await expect(panel).toBeVisible();
    return panel;
}

export function animRow(w: Page, name: string): Locator {
    return animPanel(w).locator('.anim-label-row').filter({
        has: w.locator('.anim-label-text', { hasText: new RegExp(`^${name}$`) }),
    }).first();
}

export async function animRowNames(w: Page): Promise<string[]> {
    return animPanel(w).locator('.anim-label-row .anim-label-text').allInnerTexts();
}

export function addElementButton(w: Page): Locator {
    return animPanel(w).locator('[title="Add element"]').first();
}

/**
 * Add an element by its menu label ("Simple spin", "Camera motion", ...);
 * returns its name. `onMenu` runs while the menu is open (for a shot).
 */
export async function addAnimElement(
    w: Page,
    label: string,
    onMenu?: (menu: Locator, item: Locator) => Promise<void>,
): Promise<string> {
    const before = await animRowNames(w);
    await addElementButton(w).click();
    const menu = w.locator('.bp5-popover .bp5-menu').last();
    const item = menu.getByText(label, { exact: true });
    await expect(item).toBeVisible();
    await onMenu?.(menu, item);
    await item.click();
    await expect.poll(() => animRowNames(w).then((n) => n.length)).toBe(before.length + 1);
    const after = await animRowNames(w);
    return after.find((n) => !before.includes(n))!;
}

/** Select an element row (a second click on a selected row deselects it). */
export async function selectAnimElement(w: Page, name: string): Promise<void> {
    const row = animRow(w, name);
    if (!/\bis-selected\b/.test((await row.getAttribute('class')) ?? '')) await row.click();
    await expect(row).toHaveClass(/is-selected/);
}

/**
 * Select an element row afresh (deselect, then select), so the inspector
 * shows it again: committing a Start time / Duration edit can leave the
 * inspector closed while the row stays selected.
 */
export async function reselectAnimElement(w: Page, name: string): Promise<void> {
    const row = animRow(w, name);
    if (/\bis-selected\b/.test((await row.getAttribute('class')) ?? '')) {
        await row.click();
        await expect(row).not.toHaveClass(/is-selected/);
    }
    await row.click();
    await expect(row).toHaveClass(/is-selected/);
}

/** A transport button by its title ("Play" / "Stop" / ...; titles may carry a shortcut). */
export function transportButton(w: Page, title: string): Locator {
    return animPanel(w).locator('.anim-transport').locator(`[title^="${title}"]`).first();
}

export function startCameraSelect(w: Page): Locator {
    return animPanel(w).getByLabel('Start camera').first();
}

export function currentTimeField(w: Page): Locator {
    return animPanel(w).getByLabel('Current time').first();
}

/** The playhead time as shown (`M:SS.mmm`), with the segments joined. */
export async function currentTimeText(w: Page): Promise<string> {
    return (await currentTimeField(w).innerText()).replace(/\s+/g, '');
}

export function transportBar(w: Page): Locator {
    return animPanel(w).locator('.anim-transport').first();
}

/** Type a time into the playhead's time field. */
export async function typeCurrentTime(w: Page, text: string): Promise<void> {
    await typeTime(currentTimeField(w), text);
}

/** The inspector's Duration field of the selected element. */
export function durationField(w: Page): Locator {
    return animInspectorRow(w, 'Duration').locator('.h3-form-time').first();
}

/** Set the selected element's Duration (`5s`, `0:03.000`, ...). */
export async function setAnimDuration(w: Page, text: string): Promise<void> {
    await typeTime(durationField(w), text);
}

/**
 * Type a time into a segmented time field (h3-kit TimeField): Enter on the
 * focused field opens its expression editor, which takes `1:30.500` /
 * `250ms` / `1.5s`.
 */
export async function typeTime(field: Locator, text: string): Promise<void> {
    await field.focus();
    await field.press('Enter');
    const input = field.locator('input.h3-form-time-input');
    await input.fill(text);
    await input.press('Enter');
    // A field may commit its run only when it loses focus (the inspector's
    // Start time / Duration do).
    await field.blur();
}

/** An inspector row of the animation element inspector, by its label. */
export function animInspectorRow(w: Page, label: string): Locator {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return w.locator('.h3-form-prop-row')
        .filter({ has: w.locator('.h3-form-field-label', { hasText: new RegExp(`^${escaped}$`) }) })
        .last();
}
