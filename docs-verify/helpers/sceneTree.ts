import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Scene-tree (Explorer > Scene) helpers. The tree has no test ids, so rows
 * are located by their exact visible name. Names shown elsewhere (e.g. the
 * Color pane's renderer selector) are decorated with a "(type)" suffix, so
 * an exact match stays unambiguous.
 */

/**
 * Tree rows read "name (type)" — e.g. "1crn (MolCoord)", "simple1 (simple)",
 * or "(*selection)" for the unnamed selection renderer — so rows are matched
 * on the name followed by the type suffix.
 */
export function sceneRow(window: Page, name: string): Locator {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return window.getByText(new RegExp(`^${escaped} \\(`)).first();
}

export async function expectRow(window: Page, name: string, timeoutMs = 15_000): Promise<void> {
    await expect(sceneRow(window, name)).toBeVisible({ timeout: timeoutMs });
}

export async function selectRow(window: Page, name: string): Promise<void> {
    await sceneRow(window, name).click();
}

/** Double-click shows the row's contents in the property inspector. */
export async function openInInspector(window: Page, name: string): Promise<void> {
    await sceneRow(window, name).dblclick();
}

/**
 * The eye button in a row's secondary label. Icon-only with no accessible
 * name, so it is addressed by class; its className carries the state
 * ("visible" / "hidden"). Recorded as an upstream data-testid candidate.
 */
export function rowVisibilityToggle(window: Page, name: string): Locator {
    return sceneRow(window, name)
        .locator('xpath=ancestor::div[contains(@class, "bp5-tree-node-content")]')
        .locator('.visibility-toggle');
}

export async function toggleRowVisibility(window: Page, name: string): Promise<void> {
    await rowVisibilityToggle(window, name).click();
}

/**
 * The Scene section's toolbar buttons (Add / Focus / Delete / Property)
 * share one class and carry no accessible names; they are addressed by
 * position. Recorded as an upstream data-testid candidate.
 */
const TOOLBAR_INDEX = { add: 0, focus: 1, delete: 2, property: 3 } as const;

export async function clickSceneToolbar(window: Page, which: keyof typeof TOOLBAR_INDEX): Promise<void> {
    await window.locator('.section-action-btn').nth(TOOLBAR_INDEX[which]).click();
}
