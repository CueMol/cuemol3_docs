/**
 * Doc: docs/ja/tutorials/scripting/chx-console.md (ChX console による作図)
 *
 * The tests mirror the page's numbered h2 sections. The .cxc script of §4
 * is written to the artifacts directory (the page puts it in the home
 * directory) and opened from there.
 */
import * as fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { artifacts } from '../../support/env';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, sceneRow } from '../../helpers/sceneTree';
import { fieldRow } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { clearConsole, consolePanel, runConsole, useConsoleMode } from '../../helpers/console';
import { aroundBox, docShot } from '../../helpers/docShot';

const SHOT = 'tutorials/scripting/chx-console';
const DOC = 'docs/ja/tutorials/scripting/chx-console.md';

/** §2's commands, in the page's order. */
const COMMANDS = [
    'open 1stp',
    'color #1 lightgray target c',
    'transparency #1 60 target c',
    'show (:BTN :<4) & protein',
    'style stick',
    'color :BTN orange',
    'color byhetero',
    'label (:BTN :<4) & protein residues',
    'distance :BTN@O3 :43@OH',
    'view :BTN :<5',
];

/** §4's script, as the page prints it. */
const SCRIPT = [
    '# Biotin binding site of streptavidin (PDB 1STP)',
    ...COMMANDS.slice(0, 9),
    'hbonds :BTN',
    COMMANDS[9],
].join('\n') + '\n';

let harness: CueMolHarness;

/** A fresh, empty scene in a new tab (File > New Tab, then the dialog's OK). */
async function newTab(): Promise<void> {
    const w = harness.window;
    await clickMenu(harness.app, ['File', 'New Tab']);
    // The "New Tab/Window" dialog; its default is a new, empty scene.
    const dlg = dialog(w, 'New Tab/Window');
    await expect(dlg).toBeVisible();
    await dlg.getByRole('button', { name: 'OK', exact: true }).click();
    await expectDialogClosed(w, 'New Tab/Window');
}

test.describe.serial('ChX console による作図', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
    });

    test.afterAll(async () => {
        await assertDialogQueuesEmpty(harness.app);
        await harness.close();
    });

    test.afterEach(async ({}, testInfo) => {
        testInfo.annotations.push({ type: 'doc', description: DOC });
        if (testInfo.status !== testInfo.expectedStatus && harness) {
            await testInfo.attach('app-log', { body: harness.logs.text(), contentType: 'text/plain' });
            try {
                await testInfo.attach('window', { body: await harness.window.screenshot(), contentType: 'image/png' });
            } catch { /* window may be gone */ }
        }
    });

    test('1. ChX console に切り替える', async () => {
        const w = harness.window;
        // 「Console タブを開き、ツールバー左端の切り替えで ChimeraX を選びます」
        await useConsoleMode(w, 'ChimeraX');
        // 「プロンプトが ChX> になります」
        await expect(consolePanel(w).locator('.console-prompt')).toContainText('ChX>');
        const toggle = consolePanel(w).locator('.console-toolbar').getByText('ChimeraX', { exact: true });
        await docShot(w, `${SHOT}/1-mode`, {
            rect: await aroundBox(w, consolePanel(w).locator('.console-toolbar'), 80),
            highlight: toggle,
        });
    });

    test('2. コマンドを 1 行ずつ実行する', async () => {
        const w = harness.window;
        let distance = '';
        for (const cmd of COMMANDS) {
            const out = (await runConsole(w, cmd)).join('\n');
            expect(out).not.toMatch(/^Error/m);
            if (cmd.startsWith('distance')) distance = out;
        }
        // 「ビオチンの O3 と Tyr43 の OH の距離 (2.585 Å) を測り」
        expect(distance).toContain('2.585');
        // ChX console makes its own chx: renderers.
        await expectRow(w, 'chx:cartoon');
        await expectRow(w, 'chx:stick');
        await docShot(w, `${SHOT}/2-figure`);
    });

    test('3. 対応していないコマンドの扱い', async () => {
        const w = harness.window;
        await clearConsole(w);
        const out = (await runConsole(w, 'hbonds :BTN')).join('\n');
        // 「次の警告が表示され、このコマンドは実行されません」
        expect(out).toContain('Warning: hbonds is not supported yet (a ChimeraX command the console does not have); skipped');
        await docShot(w, `${SHOT}/3-warning`, {
            rect: await aroundBox(w, consolePanel(w).locator('.console-transcript'), 40),
            highlight: consolePanel(w).locator('.console-line', { hasText: 'Warning: hbonds' }).first(),
        });
        // 「ChimeraX にも無いコマンドや書式の誤り (colr ...) は、エラーを出して ...」
        const err = (await runConsole(w, 'colr #1 red')).join('\n');
        expect(err).toContain('unknown command');
        await clearConsole(w);
    });

    test('4. スクリプトにまとめる', async () => {
        const w = harness.window;
        const file = artifacts('binding-site.cxc');
        fs.writeFileSync(file, SCRIPT);
        // 「空のシーンを用意し、ChX console で open ~/binding-site.cxc」
        await newTab();
        await useConsoleMode(w, 'ChimeraX');
        const out = (await runConsole(w, `open ${file}`)).join('\n');
        // 「hbonds の行で警告が出ますが、残りのコマンドはすべて実行され」
        expect(out).toContain('hbonds is not supported yet');
        expect(out).toContain('2.585');
        await expectRow(w, 'chx:stick');
        await clearConsole(w);
        await docShot(w, `${SHOT}/4-script`);
    });

    test('5. GUI で仕上げて保存する', async () => {
        const w = harness.window;
        // 1. Tools > Interaction... (binding-site.md §5 と同じ)
        await clickMenu(harness.app, ['Tools', 'Interaction...']);
        const dlg = dialog(w, 'Interaction analysis');
        await expect(dlg).toBeVisible();
        const sels = dlg.getByPlaceholder('* (all atoms)');
        await sels.first().fill('resn BTN');
        await fieldRow(dlg, 'Second selection').locator('.h3-form-switch').click();
        await sels.nth(1).fill('protein');
        await fieldRow(dlg, 'Hydrogen bond (N, O) only').locator('.h3-form-switch').click();
        await clickDialogButton(w, 'Interaction analysis', 'OK');
        await expectDialogClosed(w, 'Interaction analysis');
        await expect(sceneRow(w, 'measure')).toBeVisible();
        // ChX console の save で .qsc と .png に保存する
        const qsc = artifacts('binding-site.qsc');
        const png = artifacts('binding-site.png');
        for (const f of [qsc, png]) if (fs.existsSync(f)) fs.rmSync(f);
        await useConsoleMode(w, 'ChimeraX');
        await runConsole(w, `save ${qsc}`);
        await runConsole(w, `save ${png} width 1200 height 900`);
        await expect.poll(() => fs.existsSync(qsc)).toBe(true);
        await expect.poll(() => fs.existsSync(png) && fs.readFileSync(png).subarray(1, 4).toString() === 'PNG').toBe(true);
        await clearConsole(w);
        await docShot(w, `${SHOT}/5-finished`);
    });
});
