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

/**
 * Context menus (the scene tree's right-click menu, ...) are built in the
 * main process and shown with `Menu.popup`. The driver patches
 * `Menu.prototype.popup`: when a pick is queued it finds that item by its
 * real label path, fires its click handler, then the menu's `callback`
 * (Electron fires `click` before `callback`, which is the order the menu
 * code relies on). With nothing queued the menu is dismissed at once.
 * The labels of the last menu are kept for assertions.
 */
export async function installContextMenuDriver(app: ElectronApplication): Promise<void> {
    await app.evaluate(({ Menu }) => {
        const g = globalThis as unknown as {
            __e2eCtx?: { queue: string[][]; last: string[]; showNext?: boolean; shown?: unknown };
        };
        if (g.__e2eCtx) return;
        g.__e2eCtx = { queue: [], last: [] };
        type Item = { type?: string; label?: string; enabled?: boolean; submenu?: { items: Item[] } | null; click?: (...a: unknown[]) => void };
        const proto = Menu.prototype as unknown as { popup: (opts?: { callback?: () => void }) => void; items: Item[] };
        const original = proto.popup;
        proto.popup = function (this: { items: Item[] }, opts?: { callback?: () => void }) {
            const st = g.__e2eCtx!;
            st.last = this.items.filter((i) => i.type !== 'separator').map((i) => i.label ?? '');
            if (st.showNext) {
                // Show the real native menu once, for a screen capture
                // (showNativeMenu); it stays open until closeNativeMenu.
                st.showNext = false;
                st.shown = this;
                original.call(this, opts);
                return;
            }
            const path = st.queue.shift();
            setTimeout(() => {
                try {
                    if (path) {
                        let items: Item[] | undefined = this.items;
                        let picked: Item | undefined;
                        for (const label of path) {
                            picked = items?.find((i) => i.type !== 'separator' && i.label === label);
                            if (!picked) throw new Error(`[docs-verify] context menu has no item "${label}" (path ${path.join(' > ')})`);
                            items = picked.submenu?.items;
                        }
                        if (picked?.enabled === false) throw new Error(`[docs-verify] context menu item disabled: ${path.join(' > ')}`);
                        picked?.click?.({}, undefined, undefined);
                    }
                } finally {
                    opts?.callback?.();
                }
            }, 0);
        };
    });
}

/** Queue the item (a label path through submenus) the next context menu picks. */
export async function pickNextContextItem(app: ElectronApplication, path: string[]): Promise<void> {
    await app.evaluate((_electron, p) => {
        const g = globalThis as unknown as { __e2eCtx: { queue: string[][] } };
        g.__e2eCtx.queue.push(p);
    }, path);
}

/** Top-level labels of the last context menu. */
export async function lastContextLabels(app: ElectronApplication): Promise<string[]> {
    return app.evaluate(() => {
        const g = globalThis as unknown as { __e2eCtx: { last: string[] } };
        return g.__e2eCtx.last;
    });
}

/** Forget the last context menu's labels (to tell whether a new one opened). */
export async function clearLastContextLabels(app: ElectronApplication): Promise<void> {
    await app.evaluate(() => {
        const g = globalThis as unknown as { __e2eCtx: { last: string[] } };
        g.__e2eCtx.last = [];
    });
}

/**
 * Let the next context menu open for real (the native menu on macOS), so it
 * can be captured with the screen; close it with closeNativeMenu.
 */
export async function showNextNativeMenu(app: ElectronApplication): Promise<void> {
    await app.evaluate(() => {
        const g = globalThis as unknown as { __e2eCtx: { showNext?: boolean; shown?: unknown } };
        g.__e2eCtx.showNext = true;
        g.__e2eCtx.shown = undefined;
    });
}

/** Whether the real menu requested by showNextNativeMenu is open. */
export async function nativeMenuShown(app: ElectronApplication): Promise<boolean> {
    return app.evaluate(() => {
        const g = globalThis as unknown as { __e2eCtx: { shown?: unknown } };
        return g.__e2eCtx.shown !== undefined;
    });
}

/** Close the real menu opened through showNextNativeMenu. */
export async function closeNativeMenu(app: ElectronApplication): Promise<void> {
    await app.evaluate(() => {
        const g = globalThis as unknown as { __e2eCtx: { shown?: { closePopup: () => void } } };
        g.__e2eCtx.shown?.closePopup();
        g.__e2eCtx.shown = undefined;
    });
}
