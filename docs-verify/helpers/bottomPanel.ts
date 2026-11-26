import type { Page } from '@playwright/test';

/** Bring a bottom-panel tab (Console / Output / Sequence ...) to the front. */
export async function showBottomTab(window: Page, name: string): Promise<void> {
    await window.locator('.bottom-panel-tabs .bottom-tab', { hasText: new RegExp(`^${name}$`) }).first().click();
}
