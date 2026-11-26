import type { ElectronApplication } from 'playwright';

/**
 * Pane dropdowns (the Color pane's coloring type, ...) open as the
 * platform menu: on macOS the renderer sends the menu tree over IPC
 * ('popup-menu:show') and the main process pops a native Electron menu,
 * which Playwright cannot click. The stub replaces that handler with a
 * queue: a test queues the label path it means to pick, and the handler
 * resolves with that item's action, as the native menu would. The tree the
 * renderer sent is kept, so a test can assert the labels the docs name.
 *
 * Native menus cannot be captured either, so these menus have no
 * documentation shots.
 */

const CHANNEL = 'popup-menu:show';

export async function installPopupMenuStub(app: ElectronApplication): Promise<void> {
    await app.evaluate(({ ipcMain }, channel) => {
        const g = globalThis as unknown as {
            __e2ePopup?: { queue: string[][]; last: unknown[] | null };
        };
        if (g.__e2ePopup) return;
        g.__e2ePopup = { queue: [], last: null };
        type Node = { type?: string; label?: string; action?: unknown; submenu?: Node[] };
        ipcMain.removeHandler(channel);
        ipcMain.handle(channel, (_event: unknown, req: { nodes: Node[] }) => {
            const st = g.__e2ePopup!;
            st.last = req.nodes;
            const path = st.queue.shift();
            if (!path) {
                throw new Error('[docs-verify] unexpected popup menu (no pick queued)');
            }
            let nodes: Node[] | undefined = req.nodes;
            let picked: Node | undefined;
            for (const label of path) {
                picked = nodes?.find((n) => n.type !== 'separator' && n.label === label);
                if (!picked) {
                    throw new Error(`[docs-verify] popup menu has no item "${label}" (path ${path.join(' > ')})`);
                }
                nodes = picked.submenu;
            }
            return picked?.action ?? null;
        });
    }, CHANNEL);
}

/** Queue the item (a label path through submenus) the next popup menu picks. */
export async function pickNextPopupItem(app: ElectronApplication, path: string[]): Promise<void> {
    await app.evaluate((_electron, p) => {
        const g = globalThis as unknown as { __e2ePopup: { queue: string[][] } };
        g.__e2ePopup.queue.push(p);
    }, path);
}

/** Top-level labels of the last popup menu the renderer asked for. */
export async function lastPopupLabels(app: ElectronApplication): Promise<string[]> {
    return app.evaluate(() => {
        const g = globalThis as unknown as {
            __e2ePopup: { last: { type?: string; label?: string }[] | null };
        };
        return (g.__e2ePopup.last ?? [])
            .filter((n) => n.type !== 'separator')
            .map((n) => n.label ?? '');
    });
}
