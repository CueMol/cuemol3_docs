/**
 * Doc: docs/ja/tutorials/figures/protein-dna.md (タンパク質と DNA の複合体の表示)
 *
 * The tests mirror the page's numbered h2 sections.
 */
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, selectRow, clickSceneToolbar, sceneRow, rowContextMenu } from '../../helpers/sceneTree';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { runConsole, clearConsole } from '../../helpers/console';
import { addPaintRowAtTop, chooseColoring, selectColorTarget } from '../../helpers/colorPane';
import { docShot, inspectorRect, sidebarRect, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/figures/protein-dna';
const DOC = 'docs/ja/tutorials/figures/protein-dna.md';
const OBJ = '1ytb';

let harness: CueMolHarness;

async function addRenderer(type: string, atoms: string, expectName: string, shotId?: string): Promise<void> {
    const w = harness.window;
    // 「シーンツリーで 1ytb を右クリックし、New Renderer... を選びます」
    await rowContextMenu(harness.app, w, OBJ, ['New Renderer…']);
    const dlg = dialog(w, 'New Renderer');
    await expect(dlg).toBeVisible();
    await fieldControl(dlg, 'Renderer type').selectOption(type);
    await checkField(dlg, 'Selection');
    await dlg.getByPlaceholder('* (all atoms)').fill(atoms);
    if (shotId) await docShot(w, shotId, { clip: dlg });
    await clickDialogButton(w, 'New Renderer', 'Create');
    await expectDialogClosed(w, 'New Renderer');
    await expectRow(w, expectName);
}

test.describe.serial('タンパク質と DNA の複合体の表示', { tag: '@net' }, () => {
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
        await getPdb(harness.app, harness.window, {
            id: '1YTB',
            rendType: 'cartoon',
            onOptionsDialog: async (opt) => {
                await checkField(opt, 'Selection');
                await opt.getByPlaceholder('* (all atoms)').fill('chain A');
            },
        });
        await expectRow(harness.window, OBJ);
        // 「TBP が chain A / B、DNA が chain C / D」
        const out = await runConsole(harness.window, `list_chains ${OBJ}`);
        expect(out.join('\n')).toMatch(/name=A[\s\S]*name=B[\s\S]*name=C[\s\S]*name=D/);
        await clearConsole(harness.window);
    });

    test('2. DNA を nucl で表示する', async () => {
        await addRenderer('nucl', 'chain C', 'nucl1', `${SHOT}/2-new-renderer`);
    });

    test('3. 塩基の形を変える', async () => {
        const w = harness.window;
        // 「nucl1 を選びます」「Nucleic acid セクションで Base type を detail1」
        await sceneRow(w, 'nucl1').dblclick();
        const label = w.getByText('Base type', { exact: true }).last();
        if ((await label.count()) === 0) await w.getByText('Nucleic acid', { exact: true }).last().click();
        await label.scrollIntoViewIfNeeded();
        // Inspector rows: label's grandparent holds the control (as in
        // helpers/inspector.ts).
        const select = label.locator('xpath=ancestor::*[2]').locator('select').first();
        await select.selectOption('detail1');
        await expect(select).toHaveValue('detail1');
        await docShot(w, `${SHOT}/3-base-type`, {
            rect: await inspectorRect(w, select, 60),
            highlight: select,
        });
    });

    test('4. DNA を塗り分ける', async () => {
        const w = harness.window;
        // 「上部で 1ytb/nucl1 を選びます」
        await selectColorTarget(w, 'nucl1 (nucl)');
        // 「Paint coloring > Okabe-Ito > Sky blue を選びます」
        await chooseColoring(harness.app, w, ['Paint coloring', 'Okabe-Ito', 'Sky blue']);
        // 「表の一番上に行を追加し ... C.4:10,20:26.* ... Vermillion (#D55E00)」
        await addPaintRowAtTop(w, 'C.4:10,20:26.*', '#D55E00');
        await docShot(w, `${SHOT}/4-paint`, {
            rect: await sidebarRect(w, w.locator('.color-row').nth(1), 40),
            highlight: w.locator('.color-row').first(),
        });
        const out = await runConsole(w, `list_paint ${OBJ}/nucl1`);
        expect(out.join('\n')).toMatch(/1\s+#D55E00\s+C\.4:10,20:26\.\*/i);
        await clearConsole(w);
    });

    test('5. DNA に入り込むフェニルアラニンを表示する', async () => {
        await addRenderer('ballstick', 'bysidech A.99,116,190,207.*', 'ballstick1');
        const w = harness.window;
        // 4 residues' side chains (with CA): Phe has 7 side-chain heavy atoms + CA.
        const out = await runConsole(w, `count ${OBJ}, "bysidech A.99,116,190,207.*"`);
        expect(out.join('\n')).toMatch(/atomCount: \d+/);
        // For the figure: Focus on the complex and turn it so the bend shows.
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await runConsole(w, 'rotate_view y, -90');
        await clearConsole(w);
        await docShot(w, `${SHOT}/5-complex`);
        await thumbShot(w, 'protein-dna');
    });
});
