import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Everything the harness needs to launch one flavour of the app. The
 * packaged (.app) flavour plugs in here later without touching callers.
 */
export interface AppTarget {
    executablePath: string;
    args: string[];
    cwd: string;
    env: Record<string, string>;
    /** How launch readiness is detected. Dev bundles emit full main-process logs. */
    readiness: 'log' | 'ui';
}

export function cuemol2Repo(): string {
    return process.env.CUEMOL2_REPO ?? path.join(os.homedir(), 'proj64', 'cuemol2');
}

export function reactGuiDir(): string {
    return path.join(cuemol2Repo(), 'tritium', 'react-gui');
}

export function mainEntry(): string {
    return path.join(reactGuiDir(), 'out', 'main', 'index.js');
}

/** The electron package writes its binary's relative path into path.txt on install. */
export function electronBinary(): string {
    const pkgDir = path.join(reactGuiDir(), 'node_modules', 'electron');
    const rel = fs.readFileSync(path.join(pkgDir, 'path.txt'), 'utf8').trim();
    return path.join(pkgDir, 'dist', rel);
}

export function libcuemol2Root(): string {
    return process.env.LIBCUEMOL2_ROOT ?? path.join(cuemol2Repo(), '.build_out', 'cuemol2');
}

export function bundleApps(): string {
    return process.env.BUNDLE_APPS ?? path.join(os.homedir(), 'tmp', 'proj64_deplibs');
}

/** Directory for files the tests create and reopen (survives CUEMOL_FRESH_PREFS). */
export function artifacts(...parts: string[]): string {
    const p = path.join(__dirname, '..', '.artifacts', ...parts);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    return p;
}

export function devTarget(extraFiles: string[] = []): AppTarget {
    return {
        executablePath: electronBinary(),
        // A literal '.' mirrors `electron-vite preview` (`electron .`); the
        // app's argv file-loader skips '.' but would treat an absolute
        // main-entry path as a file to open ("Cannot open file: index.js").
        args: ['.', ...extraFiles],
        cwd: reactGuiDir(),
        env: {
            ...(process.env as Record<string, string>),
            LIBCUEMOL2_ROOT: libcuemol2Root(),
            BUNDLE_APPS: bundleApps(),
            // Isolated, wiped-on-start userData: deterministic prefs and no
            // clash with a normally-running CueMol3 (single-instance lock).
            CUEMOL_FRESH_PREFS: '1',
        },
        readiness: 'log',
    };
}

export function resolveTarget(extraFiles: string[] = []): AppTarget {
    if (process.env.CUEMOL_E2E_TARGET === 'packaged') {
        throw new Error('packaged target is not implemented yet (phase 1 covers the dev bundle only)');
    }
    return devTarget(extraFiles);
}
