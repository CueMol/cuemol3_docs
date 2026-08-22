import type { ElectronApplication } from 'playwright';

/**
 * Drives the native application menu through Electron's Menu API: walks the
 * labels and invokes the item's click handler, i.e. the same code path a
 * real menu click takes. The label lookup doubles as documentation
 * verification — if a menu label written in the docs disappears from the
 * app, the walk fails and lists what is actually there.
 */
export async function clickMenu(app: ElectronApplication, labels: string[]): Promise<void> {
    // Menu enablement is updated asynchronously after launch and after
    // scene changes; retry while the target item reports disabled.
    const deadline = Date.now() + 10_000;
    for (;;) {
        const result = await tryClickMenu(app, labels);
        if (!('error' in result)) return;
        if (!result.error.includes('is disabled') || Date.now() >= deadline) {
            throw new Error(`[docs-verify] clickMenu ${JSON.stringify(labels)}: ${result.error}`);
        }
        await new Promise((r) => setTimeout(r, 250));
    }
}

async function tryClickMenu(
    app: ElectronApplication,
    labels: string[],
): Promise<{ ok: true } | { error: string }> {
    return app.evaluate(({ Menu, BrowserWindow }, labels) => {
        interface Item {
            label?: string;
            role?: string;
            enabled?: boolean;
            submenu?: { items: Item[] };
            click?: (e: unknown, w: unknown, wc: unknown) => void;
        }
        const norm = (s: string) => s.replace(/…/g, '...').replace(/&/g, '').trim().toLowerCase();
        let items: Item[] = (Menu.getApplicationMenu()?.items ?? []) as unknown as Item[];
        const walked: string[] = [];
        for (let i = 0; i < labels.length; i++) {
            const want = norm(labels[i]);
            const found = items.find((it) => norm(it.label ?? '') === want);
            if (!found) {
                const avail = items.map((it) => it.label || `(${it.role ?? 'separator'})`).join(' | ');
                return { error: `"${labels[i]}" not found under [${walked.join(' > ') || 'menubar'}]; available: ${avail}` };
            }
            walked.push(found.label ?? '');
            if (i === labels.length - 1) {
                if (!found.enabled) return { error: `"${found.label}" is disabled` };
                if (!found.click) return { error: `"${found.label}" has no click handler (role-only item)` };
                const win = BrowserWindow.getAllWindows()[0];
                found.click(undefined, win, win?.webContents);
                return { ok: true as const };
            }
            items = found.submenu?.items ?? [];
        }
        return { error: 'empty menu path' };
    }, labels);
}
