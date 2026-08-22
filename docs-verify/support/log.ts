import type { ChildProcess } from 'node:child_process';

/**
 * Log lines the harness keys on. Kept in one place so a wording change in
 * the app turns into a single fix here (the lines come from the tritium
 * main/worker sources; see docs-verify/README.md).
 */
export const READY_LINES = [
    'launch worker OK',
    'CueMol2 nodejs add-on : INITIALIZED',
    'bindCanvas',
    'shader program created OK',
] as const;

/**
 * Collects the Electron main process stdout/stderr and lets tests wait for
 * lines or search a marked region. DEBUG_E2E=1 tees everything to the
 * console.
 */
export class LogCollector {
    private lines: string[] = [];
    private waiters: { substr: string; from: number; resolve: (line: string) => void }[] = [];

    attach(proc: ChildProcess): void {
        const onData = (chunk: Buffer | string) => {
            for (const raw of chunk.toString().split('\n')) {
                const line = raw.trimEnd();
                if (!line) continue;
                this.push(line);
            }
        };
        proc.stdout?.on('data', onData);
        proc.stderr?.on('data', onData);
    }

    push(line: string): void {
        this.lines.push(line);
        if (process.env.DEBUG_E2E) console.log(`[app] ${line}`);
        for (let i = this.waiters.length - 1; i >= 0; i--) {
            const w = this.waiters[i];
            if (line.includes(w.substr)) {
                this.waiters.splice(i, 1);
                w.resolve(line);
            }
        }
    }

    /** Index marking "now"; use with waitForLine's from / text(from). */
    mark(): number {
        return this.lines.length;
    }

    text(from = 0): string {
        return this.lines.slice(from).join('\n');
    }

    find(substr: string, from = 0): string | undefined {
        return this.lines.slice(from).find((l) => l.includes(substr));
    }

    async waitForLine(substr: string, opts: { timeoutMs?: number; from?: number } = {}): Promise<string> {
        const { timeoutMs = 60_000, from = 0 } = opts;
        const hit = this.find(substr, from);
        if (hit !== undefined) return hit;
        return new Promise<string>((resolve, reject) => {
            const waiter = { substr, from, resolve: (line: string) => { clearTimeout(timer); resolve(line); } };
            const timer = setTimeout(() => {
                const idx = this.waiters.indexOf(waiter);
                if (idx >= 0) this.waiters.splice(idx, 1);
                reject(new Error(
                    `timed out (${timeoutMs} ms) waiting for log line containing "${substr}".\n` +
                    `--- last 30 app log lines ---\n${this.lines.slice(-30).join('\n')}`,
                ));
            }, timeoutMs);
            this.waiters.push(waiter);
        });
    }
}
