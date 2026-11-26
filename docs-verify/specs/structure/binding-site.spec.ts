/**
 * Doc: docs/ja/tutorials/structure/binding-site.md (リガンド結合部位の表示)
 *
 * The tests mirror the page's numbered h2 sections. The "同じことをコマンドで"
 * section is verified separately with tritium_cli when the page is written.
 *
 * Not automated: §6 step 1 clicks the CA atoms of eight residues in the
 * molecular view. Where a click lands depends on the viewpoint, so the spec
 * makes the same labels with the command the page gives
 * (`set_atom_labels`, format left to the renderer) and goes on with the
 * Format step, which is GUI.
 */
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, selectRow, clickSceneToolbar, sceneRow, rowContextMenu } from '../../helpers/sceneTree';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl, fieldRow } from '../../helpers/form';
import { setNumericProperty } from '../../helpers/inspector';
import { clearConsole, runConsole, useConsoleMode } from '../../helpers/console';
import { clickMenu } from '../../helpers/menu';
import { docShot, inspectorRect, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/structure/binding-site';
const OBJ = '1stp';
const DOC = 'docs/ja/tutorials/structure/binding-site.md';

let harness: CueMolHarness;

/** 「シーンツリーで 1stp を右クリックし、New Renderer... を選びます」 */
async function addRenderer(type: string, atoms: string, expectName: string, shotId?: string): Promise<void> {
    await rowContextMenu(harness.app, harness.window, OBJ, ['New Renderer…']);
    const dlg = dialog(harness.window, 'New Renderer');
    await expect(dlg).toBeVisible();
    await fieldControl(dlg, 'Renderer type').selectOption(type);
    await checkField(dlg, 'Selection');
    await dlg.getByPlaceholder('* (all atoms)').fill(atoms);
    if (shotId) await docShot(harness.window, shotId, { clip: dlg });
    await clickDialogButton(harness.window, 'New Renderer', 'Create');
    await expectDialogClosed(harness.window, 'New Renderer');
    await expectRow(harness.window, expectName);
}

test.describe.serial('リガンド結合部位の表示', { tag: '@net' }, () => {
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

    test('1. 構造を読み込む', async () => {
        // 「File > Get PDB... で 1STP を取得します。Renderer は cartoon」
        await getPdb(harness.app, harness.window, { id: '1STP', rendType: 'cartoon' });
        await expectRow(harness.window, OBJ);
        await expectRow(harness.window, 'cartoon1');
        // 「ビオチンの残基名は BTN (残基番号 300) です」
        const out = await runConsole(harness.window, `count ${OBJ}, "resn BTN"`);
        expect(out.join('\n')).toContain('atomCount: 16');
    });

    test('2. リガンドを ballstick で表示する', async () => {
        // 「Selection にチェックを入れ、Atoms に resn BTN を入力します」
        await addRenderer('ballstick', 'resn BTN', 'ballstick1', `${SHOT}/2-new-renderer`);
        // 「ballstick1 の行を選び、パネル上部の Focus を押します」
        await selectRow(harness.window, 'ballstick1');
        await clickSceneToolbar(harness.window, 'focus');
    });

    test('3. 周辺の残基を表示する', async () => {
        const mark = harness.logs.mark();
        await addRenderer('ballstick', 'byres (resn BTN around 4.0) and protein', 'ballstick2');
        await selectRow(harness.window, 'ballstick2');
        await clickSceneToolbar(harness.window, 'focus');
        // 「16 残基が選ばれます」— 135 atoms in 1STP (checked with tritium_cli).
        const out = await runConsole(harness.window, `count ${OBJ}, "byres (resn BTN around 4.0) and protein"`);
        expect(out.join('\n')).toContain('atomCount: 135');
        await harness.logs.waitForLine('BallStickRenderer> rendered', { from: mark });
    });

    test('4. cartoon を半透明にする', async () => {
        // 「cartoon1 を選びます」「Basic settings で Opacity を 0.3 前後に」
        await sceneRow(harness.window, 'cartoon1').dblclick();
        await setNumericProperty(harness.window, 'Basic settings', 'Opacity', 0.3);
        const label = harness.window.getByText('Opacity', { exact: true }).last();
        await docShot(harness.window, `${SHOT}/4-opacity`, {
            rect: await inspectorRect(harness.window, label, 60),
            highlight: label.locator('xpath=ancestor::*[2]'),
        });
    });

    test('5. 水素結合の候補を表示する', async () => {
        await clickMenu(harness.app, ['Tools', 'Interaction...']);
        const dlg = dialog(harness.window, 'Interaction analysis');
        await expect(dlg).toBeVisible();
        // 「Molecule で 1stp を選び、その下の選択に resn BTN を指定します」
        const sels = dlg.getByPlaceholder('* (all atoms)');
        await sels.first().fill('resn BTN');
        // 「Second selection を ON にし、2 つ目の選択に protein を指定します」
        await fieldRow(dlg, 'Second selection').locator('.h3-form-switch').click();
        await expect(sels).toHaveCount(2);
        await sels.nth(1).fill('protein');
        // 「Hydrogen bond (N, O) only を ON にします」
        await fieldRow(dlg, 'Hydrogen bond (N, O) only').locator('.h3-form-switch').click();
        // 「Min distance (A) (2.5)・Max distance (A) (3.5)・Max labels (30) は既定のまま」
        await expect(fieldControl(dlg, 'Label set name')).toHaveValue('measure');
        await docShot(harness.window, `${SHOT}/5-interaction`, { clip: dlg });
        await clickDialogButton(harness.window, 'Interaction analysis', 'OK');
        await expectDialogClosed(harness.window, 'Interaction analysis');
        // 「1STP では次の 8 組です」
        await expectRow(harness.window, 'measure');
        const out = await runConsole(harness.window, `list_interactions ${OBJ}/measure`);
        const pairs = out.join('\n').split('\n').filter((l) => /distance/.test(l));
        expect(pairs).toHaveLength(8);
        expect(pairs.join('\n')).toContain('THR 90 OG1');
    });

    test('6. 残基にラベルを付ける', async () => {
        test.info().annotations.push({
            type: 'skipped-step',
            description: '§6 手順 1 の Cα のクリック (視点に依存するため、ページのコマンドでラベルを付ける)',
        });
        await useConsoleMode(harness.window, 'CueMol');
        await runConsole(harness.window, `set_atom_labels ${OBJ}, "A.23,27,43,45,49,88,90,128.CA", ""`);
        // 「シーンツリーに、ラベル用の (*namelabel) の行が作られています。この行を選びます」
        const row = harness.window.getByText('(*namelabel)', { exact: true }).first();
        await expect(row).toBeVisible();
        await row.dblclick();
        // 「Name label セクションで、Format に {resn}{resi} を入力します」
        const format = harness.window.getByPlaceholder('{chain} {resn}{resi} {name}');
        if (!(await format.isVisible().catch(() => false))) {
            await harness.window.getByText('Name label', { exact: true }).last().click();
        }
        await format.fill('{resn}{resi}');
        await format.press('Enter');
        await expect(format).toHaveValue('{resn}{resi}');
        await docShot(harness.window, `${SHOT}/6-format`, {
            rect: await inspectorRect(harness.window, format, 60),
            highlight: format,
        });
        // The spec's own console lines are not part of the page's steps.
        await clearConsole(harness.window);
        await docShot(harness.window, `${SHOT}/6-labeled`);
        await thumbShot(harness.window, 'binding-site');
    });
});

