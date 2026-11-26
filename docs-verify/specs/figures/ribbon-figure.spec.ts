/**
 * Doc: docs/ja/tutorials/figures/ribbon-figure.md (タンパク質のリボン図の表示)
 *
 * The tests mirror the page's numbered h2 sections. The scene tree's
 * context menu (New Renderer..., Style) is native on macOS; the
 * context-menu driver picks it by label (helpers/popupMenu.ts), and the
 * Color pane's coloring menu goes through the popup-menu stub.
 */
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import {
    assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed, expectSaveDialog,
} from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { clickSceneToolbar, expectRow, rowContextMenu, sceneRow, selectRow } from '../../helpers/sceneTree';
import { addPaintRowAtTop, chooseColoring, colorPane, paintSelections, selectColorTargetOf } from '../../helpers/colorPane';
import { openSidebarView } from '../../helpers/sidebar';
import { runConsole, clearConsole } from '../../helpers/console';
import { docShot, sidebarRect, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/figures/ribbon-figure';
const DOC = 'docs/ja/tutorials/figures/ribbon-figure.md';
const OBJ = '3ug9';
const QSC = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'docs-verify-')), '3ug9.qsc');

let harness: CueMolHarness;

test.describe.serial('タンパク質のリボン図の表示', { tag: '@net' }, () => {
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

    test('1. 構造を取得する', async () => {
        const w = harness.window;
        // 「PDB or EMDB ID, or keywords に 3UG9 ... Renderer type から cartoon」
        await getPdb(harness.app, w, {
            id: '3UG9',
            rendType: 'cartoon',
            onGetPdbDialog: (dlg) => docShot(w, `${SHOT}/1-getpdb`, { clip: dlg }),
            onOptionsDialog: (dlg) => docShot(w, `${SHOT}/1-open-options`, { clip: dlg }),
        });
        await expectRow(w, OBJ);
        await expectRow(w, 'cartoon1');
    });

    test('2. 視点を合わせる', async () => {
        const w = harness.window;
        // 「Object (3UG9) を選び、パネル上部の Focus ボタンを押します」
        await openSidebarView(w, 'explorer');
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
    });

    test('3. cartoon の見た目を調整する', async () => {
        const w = harness.window;
        // 「Helix、Sheet、Coil の各セクションで調整します」
        await sceneRow(w, 'cartoon1').dblclick();
        for (const sec of ['Helix', 'Sheet', 'Coil']) {
            await expect(w.getByText(sec, { exact: true }).last()).toBeVisible();
        }
    });

    test('4. ドメインごとに色を塗り分ける', async () => {
        const w = harness.window;
        // 「1. Explorer > Color パネルを開きます」「2. 上部で cartoon の Renderer を選びます」
        await openSidebarView(w, 'explorer');
        await selectColorTargetOf(w, OBJ, 'cartoon1');
        // 「3. Paint coloring > Okabe-Ito > Orange ... sheet / helix / nucleic / * の 4 行」
        await chooseColoring(harness.app, w, ['Paint coloring', 'Okabe-Ito', 'Orange']);
        await expect.poll(() => paintSelections(w)).toEqual(['sheet', 'helix', 'nucleic', '*']);
        // 「4. 表の一番上に次の 3 行を追加し、選択式と色を指定します」(each new row goes
        // above the first row, so the last one added ends up on top)
        await addPaintRowAtTop(w, 'A.318:342.*', '#009E73');
        await addPaintRowAtTop(w, 'A.84:317.*', '#56B4E9');
        await addPaintRowAtTop(w, 'A.49:83.*', '#E69F00');
        await expect.poll(() => paintSelections(w)).toEqual(
            ['A.49:83.*', 'A.84:317.*', 'A.318:342.*', 'sheet', 'helix', 'nucleic', '*']);
        await runConsole(w, `set_mol_selection ${OBJ}, ""`);
        await clearConsole(w);
        // Fold the Camera pane so the table shows in full.
        await w.locator('.sp-pane.camera-pane .section-title').first().click();
        await docShot(w, `${SHOT}/4-paint-table`, {
            rect: await sidebarRect(w, colorPane(w), 10),
            highlight: [0, 1, 2].map((i) => w.locator('.color-row').nth(i)),
            mergeHighlight: true,
        });
        await w.locator('.sp-pane.camera-pane .section-title').first().click();
        await docShot(w, `${SHOT}/4-painted`);
    });

    test('5. リガンドを ballstick で表示', async () => {
        const w = harness.window;
        // 「1. Object (3UG9) を右クリックし、New Renderer... を選びます」
        await rowContextMenu(harness.app, w, OBJ, ['New Renderer…']);
        const dlg = dialog(w, 'New Renderer');
        await expect(dlg).toBeVisible();
        await expect(dlg.getByText('Center view on molecule after loading', { exact: true })).toBeVisible();
        // 「2. ballstick」「3. Selection にチェックを入れ、選択式に r; RET」
        await fieldControl(dlg, 'Renderer type').selectOption('ballstick');
        await checkField(dlg, 'Selection');
        await dlg.getByPlaceholder('* (all atoms)').fill('r; RET');
        await docShot(w, `${SHOT}/5-new-renderer`, { clip: dlg });
        await clickDialogButton(w, 'New Renderer', 'Create');
        await expectDialogClosed(w, 'New Renderer');
        await expectRow(w, 'ballstick1');
        // 「レチナール (残基名 RET)」
        const out = await runConsole(w, `count ${OBJ}, "r; RET"`);
        expect(Number(/atomCount: (\d+)/.exec(out.join('\n'))?.[1])).toBeGreaterThan(0);
        await clearConsole(w);
        // 「5. 分子全体を見るには、手順 2 と同じく Object (3UG9) を選んで Focus を押します」
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await w.waitForTimeout(800);
        await docShot(w, `${SHOT}/5-ligand`);
    });

    test('6. 背景と輪郭線で仕上げる', async () => {
        const w = harness.window;
        // 「1. Scene > Background > White で背景を白にします」
        await clickMenu(harness.app, ['Scene', 'Background', 'White']);
        // 「2〜3. cartoon の Renderer を右クリックし、Style > Edge line (normal)」
        await rowContextMenu(harness.app, w, 'cartoon1', ['Style', 'Edge line (normal)']);
        // 「4. ballstick の Renderer にも、同じ操作を繰り返します」
        await rowContextMenu(harness.app, w, 'ballstick1', ['Style', 'Edge line (normal)']);
        for (const r of ['cartoon1', 'ballstick1']) {
            const out = await runConsole(w, `get ${OBJ}/${r}.style`);
            expect(out.join('\n')).toMatch(/EgLineNormal/);
        }
        const bg = await runConsole(w, 'get bgcolor');
        expect(bg.join('\n')).toMatch(/#?F{6}|white|1,\s*1,\s*1/i);
        await clearConsole(w);
        await docShot(w, `${SHOT}/6-finished`);
        await thumbShot(w, 'ribbon-figure');
    });

    test('7. カメラとシーンを保存する', async () => {
        const w = harness.window;
        // 「1. Explorer > Camera パネル」「2. New camera from view ボタンを押し、名前を付けて作成します」
        await openSidebarView(w, 'explorer');
        await w.locator('.sp-pane.camera-pane .section-action-btn').first().click();
        await clickDialogButton(w, 'New Camera', 'Create');
        await expectDialogClosed(w, 'New Camera');
        await expect(w.locator('.sp-pane.camera-pane').getByText('camera_0', { exact: true })).toBeVisible();
        // 「File > Save Scene ... Scene options ダイアログで Embed possible を有効にすると」
        await expectSaveDialog(harness.app, QSC);
        await clickMenu(harness.app, ['File', 'Save Scene']);
        const opts = dialog(w, 'Scene options');
        await expect(opts).toBeVisible();
        await checkField(opts, 'Embed possible').catch(async () => {
            await opts.getByText('Embed possible', { exact: true }).click();
        });
        await clickDialogButton(w, 'Scene options', 'OK');
        await expectDialogClosed(w, 'Scene options');
        await expect.poll(() => fs.existsSync(QSC) && fs.statSync(QSC).size > 0, { timeout: 30_000 }).toBe(true);
    });
});
