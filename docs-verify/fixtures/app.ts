import { _electron, type ElectronApplication, type Page } from 'playwright';
import { resolveTarget } from '../support/env';
import { LogCollector, READY_LINES } from '../support/log';
import { installDialogStubs } from '../helpers/dialogs';

const READY_LINE_TIMEOUT_MS = 60_000;
const QUIT_TIMEOUT_MS = 15_000;

/**
 * Launches and owns one instance of the CueMol3 dev bundle. Scenario specs
 * hold a single harness for their whole serial group; helpers always take
 * window/app as arguments so restart() can swap them out.
 */
export class CueMolHarness {
    private constructor(
        public app: ElectronApplication,
        public window: Page,
        public logs: LogCollector,
        private extraFiles: string[],
    ) {}

    static async launch(opts: { extraFiles?: string[] } = {}): Promise<CueMolHarness> {
        const extraFiles = opts.extraFiles ?? [];
        const target = resolveTarget(extraFiles);
        const app = await _electron.launch({
            executablePath: target.executablePath,
            args: target.args,
            cwd: target.cwd,
            env: target.env,
        });

        const logs = new LogCollector();
        const proc = app.process();
        logs.attach(proc);

        if (target.readiness === 'log') {
            for (const line of READY_LINES) {
                await logs.waitForLine(line, { timeoutMs: READY_LINE_TIMEOUT_MS });
            }
        }

        const window = await app.firstWindow();
        await window.locator('canvas').first().waitFor({ state: 'visible', timeout: 30_000 });

        // Fixed window size: the ground for any coordinate-dependent gestures.
        // E2E_WINDOW overrides it (e.g. "1280x800" for documentation shots,
        // where a smaller window keeps the UI legible at web display widths).
        const [winW, winH] = (process.env.E2E_WINDOW ?? '1600x1000').split('x').map(Number);
        if (!Number.isInteger(winW) || !Number.isInteger(winH)) {
            throw new Error(`E2E_WINDOW must look like "1280x800", got: ${process.env.E2E_WINDOW}`);
        }
        await app.evaluate(({ BrowserWindow }, size) => {
            const win = BrowserWindow.getAllWindows()[0];
            win.setSize(size.w, size.h);
            win.center();
        }, { w: winW, h: winH });

        await installDialogStubs(app);
        return new CueMolHarness(app, window, logs, extraFiles);
    }

    /**
     * Quit recipe (from tritium/CLAUDE.md): app.close() blocks on the
     * renderer-side ConfirmCloseTabDialog when a scene has unsaved changes.
     * Walk the dialogs with "Don't Save", then SIGKILL as a last resort.
     */
    async close(): Promise<void> {
        const proc = this.app.process();
        const exited = new Promise<void>((resolve) => {
            if (proc.exitCode !== null) return resolve();
            proc.once('exit', () => resolve());
        });
        const closing = this.app.close().catch(() => {});

        for (let i = 0; i < 8; i++) {
            try {
                const dlg = this.window.locator('.bp5-dialog');
                await dlg.waitFor({ state: 'visible', timeout: 2_000 });
                await dlg.getByRole('button', { name: "Don't Save" }).click({ timeout: 2_000 });
            } catch {
                break; // no dialog (clean quit) or the page is already gone
            }
        }

        const timedOut = await Promise.race([
            Promise.all([closing, exited]).then(() => false),
            new Promise<boolean>((r) => setTimeout(() => r(true), QUIT_TIMEOUT_MS)),
        ]);
        if (timedOut) {
            proc.kill('SIGKILL');
            await exited;
        }
    }

    /** Quit and launch again (used by scenarios that include an app restart). */
    async restart(): Promise<void> {
        await this.close();
        const next = await CueMolHarness.launch({ extraFiles: this.extraFiles });
        this.app = next.app;
        this.window = next.window;
        this.logs = next.logs;
    }
}
