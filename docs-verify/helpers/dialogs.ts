import type { ElectronApplication, Locator, Page } from 'playwright';

/**
 * Native-dialog stubbing (main process) and Blueprint-dialog helpers.
 *
 * The app opens native open/save dialogs from the main process
 * (fileDialogs.ts / ipcHandlers.ts / renderWindowIpc.ts in tritium). The
 * stub replaces them with queue consumers: a test queues the answer it
 * expects the next dialog to return. An unqueued native dialog rejects
 * immediately instead of hanging the run.
 */

export async function installDialogStubs(app: ElectronApplication): Promise<void> {
    await app.evaluate(({ dialog }) => {
        const g = globalThis as unknown as {
            __e2eDialogs?: { open: unknown[]; save: unknown[]; msg: unknown[] };
        };
        if (g.__e2eDialogs) return;
        g.__e2eDialogs = { open: [], save: [], msg: [] };
        const take = (kind: 'open' | 'save' | 'msg') => {
            const q = g.__e2eDialogs![kind];
            if (q.length === 0) {
                throw new Error(`[docs-verify] unexpected native ${kind} dialog (no stub queued)`);
            }
            return q.shift();
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const d = dialog as any;
        d.showOpenDialog = async () => take('open');
        d.showOpenDialogSync = () => (take('open') as { filePaths: string[] }).filePaths;
        d.showSaveDialog = async () => take('save');
        d.showSaveDialogSync = () => (take('save') as { filePath: string }).filePath;
        d.showMessageBox = async () => take('msg');
        d.showMessageBoxSync = () => (take('msg') as { response: number }).response;
    });
}

export async function expectOpenDialog(app: ElectronApplication, ...filePaths: string[]): Promise<void> {
    await app.evaluate((_electron, paths) => {
        const g = globalThis as unknown as { __e2eDialogs: { open: unknown[] } };
        g.__e2eDialogs.open.push({ canceled: false, filePaths: paths });
    }, filePaths);
}

export async function expectSaveDialog(app: ElectronApplication, filePath: string): Promise<void> {
    await app.evaluate((_electron, p) => {
        const g = globalThis as unknown as { __e2eDialogs: { save: unknown[] } };
        g.__e2eDialogs.save.push({ canceled: false, filePath: p });
    }, filePath);
}

/** Assert every queued dialog answer was consumed (the expected dialogs actually opened). */
export async function assertDialogQueuesEmpty(app: ElectronApplication): Promise<void> {
    const left = await app.evaluate(() => {
        const g = globalThis as unknown as {
            __e2eDialogs?: { open: unknown[]; save: unknown[]; msg: unknown[] };
        };
        if (!g.__e2eDialogs) return null;
        const { open, save, msg } = g.__e2eDialogs;
        return { open: open.length, save: save.length, msg: msg.length };
    });
    if (left && (left.open || left.save || left.msg)) {
        throw new Error(`[docs-verify] queued dialog answers were not consumed: ${JSON.stringify(left)}`);
    }
}

// ---- Blueprint (in-page) dialogs ----

/**
 * A Blueprint dialog addressed by its accessible name (the dialog title).
 * Several dialogs can coexist (e.g. a download-progress dialog behind an
 * options dialog), so helpers always scope to one title.
 */
export function dialog(window: Page, title: string | RegExp): Locator {
    return window.getByRole('dialog', { name: title });
}

export async function clickDialogButton(
    window: Page,
    title: string | RegExp,
    button: string,
): Promise<void> {
    await dialog(window, title).getByRole('button', { name: button, exact: true }).click();
}

export async function expectDialogClosed(
    window: Page,
    title: string | RegExp,
    timeoutMs = 30_000,
): Promise<void> {
    await dialog(window, title).waitFor({ state: 'detached', timeout: timeoutMs });
}
