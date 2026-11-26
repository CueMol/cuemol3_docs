import { expect, type ElectronApplication, type Locator, type Page } from '@playwright/test';
import { clickMenu } from './menu';

const isRenderWindow = (url: string) => url.includes('render.html');

/**
 * Open the rendering window from a Rendering menu item (`Image rendering...`
 * or `Movie rendering...`) and return its page. The window is a separate
 * BrowserWindow (render.html); for documentation shots it is resized to the
 * shot size, since it opens at its own default size.
 */
export async function openRenderWindow(app: ElectronApplication, item: string): Promise<Page> {
    await clickMenu(app, ['Rendering', item]);
    await expect
        .poll(() => app.windows().some((w) => isRenderWindow(w.url())), { timeout: 15_000 })
        .toBe(true);
    const page = app.windows().find((w) => isRenderWindow(w.url()))!;
    await page.waitForLoadState('domcontentloaded');
    if (process.env.DOCSHOT) {
        await app.evaluate(({ BrowserWindow }) => {
            // Electron types are not installed here, hence the anys.
            const wins: any[] = BrowserWindow.getAllWindows();
            wins.find((w) => w.webContents.getURL().includes('render.html'))?.setSize(1280, 800);
        });
    }
    await expect(startRenderButton(page)).toBeVisible();
    return page;
}

export function startRenderButton(rw: Page): Locator {
    return rw.getByRole('button', { name: 'Start Render', exact: true });
}

/** The settings pane's Image / Render tab strip. */
export async function showSettingsTab(rw: Page, tab: 'Image' | 'Render'): Promise<void> {
    await rw.getByRole('radio', { name: tab, exact: true }).click();
}

/** The select that follows a field label in the settings pane. */
export function settingSelect(rw: Page, label: string): Locator {
    return rw.getByText(label, { exact: true }).first().locator('xpath=following::select[1]');
}

/** Run Start Render and wait for the result image (Umbreon raytrace). */
export async function startRender(rw: Page, timeout = 600_000): Promise<void> {
    await startRenderButton(rw).click();
    await expect(rw.getByAltText('Render result')).toBeVisible({ timeout });
}
