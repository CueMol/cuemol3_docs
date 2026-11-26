import type { Page } from '@playwright/test';

/**
 * Activity bar views. The items carry no accessible name (a tooltip only),
 * so they are addressed by position in the built-in order
 * (ActivityBar.tsx BUILTIN_ACTIVITY_ITEMS).
 */
const VIEW_INDEX = { explorer: 0, styles: 1, selection: 2, crystal: 3, actions: 4 } as const;

export async function openSidebarView(window: Page, view: keyof typeof VIEW_INDEX): Promise<void> {
    const item = window.locator('.activity-bar-top .activity-bar-item').nth(VIEW_INDEX[view]);
    const cls = (await item.getAttribute('class')) ?? '';
    if (!/\bactive\b/.test(cls)) await item.click();
}
