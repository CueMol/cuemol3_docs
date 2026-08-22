/**
 * Preflight check: verifies everything the harness needs before Playwright
 * starts, with actionable messages. Run via `npm run doctor` (or `task e2e`).
 */
import * as fs from 'node:fs';
import {
    bundleApps,
    cuemol2Repo,
    electronBinary,
    libcuemol2Root,
    mainEntry,
    reactGuiDir,
} from '../support/env';

interface Check {
    label: string;
    path: string;
    hint: string;
}

const checks: Check[] = [
    {
        label: 'cuemol2 repository',
        path: cuemol2Repo(),
        hint: 'set CUEMOL2_REPO to the cuemol2 checkout',
    },
    {
        label: 'dev bundle (out/main/index.js)',
        path: mainEntry(),
        hint: `run \`task build_tritium\` in ${cuemol2Repo()}/build_scripts`,
    },
    {
        label: 'electron binary',
        path: (() => {
            try {
                return electronBinary();
            } catch {
                return `${reactGuiDir()}/node_modules/electron (missing)`;
            }
        })(),
        hint: `run \`pnpm install\` in ${reactGuiDir()}`,
    },
    {
        label: 'LIBCUEMOL2_ROOT',
        path: libcuemol2Root(),
        hint: 'build libcuemol2 first, or set LIBCUEMOL2_ROOT',
    },
    {
        label: 'BUNDLE_APPS',
        path: bundleApps(),
        hint: 'set BUNDLE_APPS to the deplibs directory (povray/apbs/ffmpeg)',
    },
];

let failed = false;
for (const c of checks) {
    const ok = fs.existsSync(c.path);
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${c.label}: ${c.path}`);
    if (!ok) {
        console.log(`      -> ${c.hint}`);
        failed = true;
    }
}

if (failed) {
    console.error('\ndoctor: some prerequisites are missing (see above).');
    process.exit(1);
}
console.log('\ndoctor: all prerequisites look good.');
