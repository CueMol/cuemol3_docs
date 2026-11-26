/**
 * Doc: docs/ja/tutorials/structure/superpose.md (構造の重ね合わせと比較)
 *
 * The tests mirror the page's numbered h2 sections. The RMSD values the page
 * gives are read back from the Output panel (LSQ prints "RMSD").
 */
import { test, expect, type Locator } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, rowContextMenu } from '../../helpers/sceneTree';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { runConsole, clearConsole } from '../../helpers/console';
import { addPaintRowAtTop, chooseColoring, selectColorTarget } from '../../helpers/colorPane';
import { showBottomTab } from '../../helpers/bottomPanel';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/structure/superpose';
const DOC = 'docs/ja/tutorials/structure/superpose.md';
const CORE = 'A.1:29,60:121,160:214.CA';

let harness: CueMolHarness;

async function selectMol(section: Locator, name: string): Promise<void> {
    const sel = section.getByRole('combobox', { name: 'Molecule' }).first();
    const v = await sel.locator('option').filter({ hasText: name }).first().getAttribute('value');
    if (v === null) throw new Error(`no molecule ${name}`);
    await sel.selectOption(v);
}

/** Run LSQ with the same selection on both sides; returns the Output RMSD. */
async function lsq(selection: string, shotId?: string): Promise<number> {
    const w = harness.window;
    await showBottomTab(w, 'Output');
    await w.getByRole('button', { name: 'Clear' }).first().click().catch(() => {});
    await clickMenu(harness.app, ['Tools', 'Molecular superposition...']);
    const dlg = dialog(w, 'Molecular superposition');
    await expect(dlg).toBeVisible();
    // 「Method で LSQ を選びます」
    await dlg.getByText('LSQ', { exact: true }).click();
    const sections = dlg.locator('.h3-form-field-section');
    const ref = sections.filter({ hasText: /^Reference/ }).first();
    const mov = sections.filter({ hasText: /^Moving/ }).first();
    await selectMol(ref, '1ake');
    await ref.getByPlaceholder('* (all atoms)').fill(selection);
    await selectMol(mov, '4ake');
    await mov.getByPlaceholder('* (all atoms)').fill(selection);
    if (shotId) await docShot(w, shotId, { clip: dlg });
    await clickDialogButton(w, 'Molecular superposition', 'OK');
    await expectDialogClosed(w, 'Molecular superposition', 60_000);
    await showBottomTab(w, 'Output');
    const output = w.locator('.bottom-panel-content pre[data-select-scope]').first();
    await expect(output).toContainText('RMSD', { timeout: 60_000 });
    const all = [...(await output.innerText()).matchAll(/RMSD[^\d]*([\d.]+)/g)];
    return Number(all.at(-1)?.[1]);
}

test.describe.serial('構造の重ね合わせと比較', { tag: '@net' }, () => {
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

    test('1. 2 つの構造を読み込む', async () => {
        const w = harness.window;
        for (const id of ['4AKE', '1AKE']) {
            await getPdb(harness.app, w, {
                id,
                rendType: 'cartoon',
                onOptionsDialog: async (opt) => {
                    await checkField(opt, 'Selection');
                    await opt.getByPlaceholder('* (all atoms)').fill('chain A');
                },
            });
        }
        await expectRow(w, '4ake');
        await expectRow(w, '1ake');
        // 「chain A に、阻害剤 Ap5A (残基名 AP5) が結合しています ... ballstick で表示」
        await rowContextMenu(harness.app, w, '1ake', ['New Renderer…']);
        const dlg = dialog(w, 'New Renderer');
        await expect(dlg).toBeVisible();
        await fieldControl(dlg, 'Renderer type').selectOption('ballstick');
        await checkField(dlg, 'Selection');
        await dlg.getByPlaceholder('* (all atoms)').fill('chain A and resn AP5');
        await clickDialogButton(w, 'New Renderer', 'Create');
        await expectDialogClosed(w, 'New Renderer');
        await expectRow(w, 'ballstick1');
        const out = await runConsole(w, 'count 4ake, "chain A and name CA"');
        expect(out.join('\n')).toContain('atomCount: 214');
        await clearConsole(w);
    });

    test('2. 全体の Cα で重ね合わせる', async () => {
        // 「Output に表示される RMSD は約 7.1 Å です」
        const rmsd = await lsq('chain A and name CA', `${SHOT}/2-lsq-all`);
        console.log(`[superpose] all CA RMSD ${rmsd}`);
        expect(rmsd).toBeGreaterThan(7.0);
        expect(rmsd).toBeLessThan(7.2);
    });

    test('3. 動かない部分で重ね合わせる', async () => {
        // 「RMSD は約 2.0 Å になります」
        const rmsd = await lsq(CORE);
        console.log(`[superpose] core CA RMSD ${rmsd}`);
        expect(rmsd).toBeGreaterThan(1.9);
        expect(rmsd).toBeLessThan(2.1);
    });

    test('4. ドメインを塗り分ける', async () => {
        const w = harness.window;
        // 「上部で 4ake/cartoon1 を選びます」(4AKE is loaded first: cartoon1)
        await selectColorTarget(w, 'cartoon1 (cartoon)');
        // 「Paint coloring > Okabe-Ito > Orange を選びます」
        await chooseColoring(harness.app, w, ['Paint coloring', 'Okabe-Ito', 'Orange']);
        // 「表の一番上に行を追加し ... A.30:59.* ... Bluish green (#009E73)」
        await addPaintRowAtTop(w, 'A.30:59.*', '#009E73');
        // 「もう一度、表の一番上に行を追加し ... A.122:159.* ... Vermillion (#D55E00)」
        await addPaintRowAtTop(w, 'A.122:159.*', '#D55E00');
        await docShot(w, `${SHOT}/4-paint`, {
            rect: await sidebarRect(w, w.locator('.color-row').nth(2), 40),
            highlight: [w.locator('.color-row').nth(0), w.locator('.color-row').nth(1)],
            mergeHighlight: true,
        });
        const out = await runConsole(w, 'list_paint 4ake/cartoon1');
        const text = out.join('\n');
        expect(text).toMatch(/1\s+#D55E00\s+A\.122:159\.\*/i);
        expect(text).toMatch(/2\s+#009E73\s+A\.30:59\.\*/i);
        // For the figure only: look perpendicular to the plane through the
        // CORE / NMP / LID centres of 1AKE (computed from the coordinates),
        // where the opening of NMP and LID shows. The page asks the reader
        // to turn the molecule to find such a view.
        await runConsole(w, 'set_view 60, 80, center="25.54 47.84 19.26", rotation="0.8169 -0.5256 0.1422 -0.1900"');
        await clearConsole(w);
        await docShot(w, `${SHOT}/4-domains`);
    });
});
