/**
 * Doc: docs/ja/tutorials/prediction/alphafold.md (AlphaFold の予測構造の評価)
 *
 * The tests mirror the page's numbered h2 sections.
 *
 * Not automated: §3 step 3 (scene tree right-click > Change sel > Current)
 * is a native context menu. The spec applies the same change with the
 * page's command (`set_renderer_selection`) after doing steps 1-2 in the
 * Selection panel.
 */
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, sceneRow } from '../../helpers/sceneTree';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { runConsole, clearConsole } from '../../helpers/console';
import { chooseColoring, selectColorTarget } from '../../helpers/colorPane';
import { openSidebarView } from '../../helpers/sidebar';
import { showBottomTab } from '../../helpers/bottomPanel';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/prediction/alphafold';
const DOC = 'docs/ja/tutorials/prediction/alphafold.md';
const AF = 'AF-P04637-F1';
const NET_TIMEOUT_MS = 90_000;

let harness: CueMolHarness;

test.describe.serial('AlphaFold の予測構造の評価', { tag: '@net' }, () => {
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

    test('1. AlphaFold DB から取得する', async () => {
        const w = harness.window;
        await clickMenu(harness.app, ['File', 'Get PDB...']);
        const dlg = dialog(w, 'Get PDB');
        await expect(dlg).toBeVisible();
        // 「Database で AlphaFold DB を選びます」
        await dlg.getByText('AlphaFold DB', { exact: true }).click();
        // 「UniProt accession or AlphaFold ID に P04637 を入力します」
        await dlg.getByLabel('UniProt accession or AlphaFold ID').fill('P04637');
        // 「遺伝子・生物種・残基数 (393)・mean pLDDT が表示されます」
        await expect(dlg).toContainText('393', { timeout: NET_TIMEOUT_MS });
        await expect(dlg).toContainText(/mean pLDDT/i);
        await docShot(w, `${SHOT}/1-getpdb`, { clip: dlg });
        // 「Format は既定の mmCIF のままで Download を押します」
        await clickDialogButton(w, 'Get PDB', 'Download');
        const options = dialog(w, 'Open File Options');
        await expect(options).toBeVisible({ timeout: NET_TIMEOUT_MS });
        // 「Object 名は AF-P04637-F1 になります」
        await expect(fieldControl(options, 'Object name')).toHaveValue(AF);
        await fieldControl(options, 'Renderer type').selectOption('cartoon');
        await options.getByRole('button', { name: 'Open', exact: true }).click();
        await expectDialogClosed(w, 'Open File Options');
        await expectRow(w, AF);
        await expectRow(w, 'cartoon1');
    });

    test('2. pLDDT 値を可視化する', async () => {
        // The counts the page's command section gives.
        const hi = await runConsole(harness.window, `count ${AF}, "bfac>70 and name CA"`);
        expect(hi.join('\n')).toContain('atomCount: 233');
        const lo = await runConsole(harness.window, `count ${AF}, "bfac<50 and name CA"`);
        expect(lo.join('\n')).toContain('atomCount: 117');
        await clearConsole(harness.window);
        await docShot(harness.window, `${SHOT}/2-plddt`);
    });

    test('3. 信頼度の高い部分だけを表示する', async () => {
        const w = harness.window;
        // 「Selection > Selection パネルを開き、Molecule で AF-P04637-F1 を選びます」
        await openSidebarView(w, 'selection');
        const pane = w.locator('.sp-pane').filter({ has: w.getByPlaceholder('Input selection command') }).first();
        await selectMol(pane, AF);
        // 「Selection 欄に bfac>70 を入力し、Enter を押します」
        const input = pane.getByPlaceholder('Input selection command');
        await input.fill('bfac>70');
        await input.press('Enter');
        await docShot(w, `${SHOT}/3-selection`, {
            rect: await sidebarRect(w, pane.locator('.selection-actions'), 60),
            highlight: input,
        });
        test.info().annotations.push({
            type: 'skipped-step',
            description: '§3 手順 3 の Change sel > Current (ネイティブの右クリックメニューのため、ページのコマンドで同じ変更をする)',
        });
        await runConsole(w, `set_renderer_selection ${AF}/cartoon1, "bfac>70"`);
        await runConsole(w, `set_mol_selection ${AF}, ""`);
        await clearConsole(w);
        await openSidebarView(w, 'explorer');
        await sceneRow(w, 'cartoon1').click();
        await w.locator('.sp-pane').first().locator('.section-action-btn').nth(1).click();
        await docShot(w, `${SHOT}/3-high-confidence`);
    });

    test('4. 実験構造を読み込む', async () => {
        const w = harness.window;
        // 「Get PDB で 2OCJ を取得します (Database は ... PDB / EMDB に戻ります)」
        await getPdb(harness.app, w, {
            id: '2OCJ',
            rendType: 'cartoon',
            onOptionsDialog: async (opt) => {
                // 「Selection にチェックを入れて Atoms に chain A を入力します」
                await checkField(opt, 'Selection');
                await opt.getByPlaceholder('* (all atoms)').fill('chain A');
            },
        });
        await expectRow(w, '2ocj');
        // 「上部で 2ocj の cartoon2 を選びます」— GUI renderer names are unique
        // across the scene, so 2OCJ's cartoon is cartoon2.
        await expectRow(w, 'cartoon2');
        await selectColorTarget(w, 'cartoon2 (cartoon)');
        // 「Paint coloring > Okabe-Ito > Reddish purple を選びます」
        await chooseColoring(harness.app, w, ['Paint coloring', 'Okabe-Ito', 'Reddish purple']);
        const out = await runConsole(w, 'list_paint 2ocj/cartoon2');
        expect(out.join('\n')).toContain('okabeito_7');
        await clearConsole(w);
    });

    test('5. 予測構造を実験構造に重ね合わせる', async () => {
        const w = harness.window;
        await clickMenu(harness.app, ['Tools', 'Molecular superposition...']);
        const dlg = dialog(w, 'Molecular superposition');
        await expect(dlg).toBeVisible();
        // 「Method は既定の US-align のままにします」
        const sections = dlg.locator('.h3-form-field-section');
        const ref = sections.filter({ hasText: /^Reference/ }).first();
        const mov = sections.filter({ hasText: /^Moving/ }).first();
        // 「Reference の Molecule で 2ocj を選び、Selection に chain A」
        await selectMol(ref, '2ocj');
        await ref.getByPlaceholder('* (all atoms)').fill('chain A');
        // 「Moving の Molecule で AF-P04637-F1 を選び、Selection に resi 96:289」
        await selectMol(mov, AF);
        await mov.getByPlaceholder('* (all atoms)').fill('resi 96:289');
        await docShot(w, `${SHOT}/5-superpose`, { clip: dlg });
        await clickDialogButton(w, 'Molecular superposition', 'OK');
        await expectDialogClosed(w, 'Molecular superposition', 60_000);
        // 「RMSD は 1 Å を下回り、TM-score は 1 に近い値になります」
        await showBottomTab(w, 'Output');
        const output = w.locator('.bottom-panel-content pre[data-select-scope]').first();
        await expect(output).toContainText('US-align superpose result', { timeout: 60_000 });
        const text = await output.innerText();
        const rmsd = Number(/RMSD:\s*([\d.]+)/.exec(text)?.[1]);
        const tm = Number(/TM-score:\s*([\d.]+)/.exec(text)?.[1]);
        test.info().annotations.push({ type: 'result', description: `RMSD ${rmsd} / TM-score ${tm}` });
        console.log(`[alphafold] US-align RMSD ${rmsd} / TM-score ${tm}`);
        expect(rmsd).toBeLessThan(1);
        expect(tm).toBeGreaterThan(0.9);
        // The overall figure with the (cleared) Console in front; the
        // Output tail is alignment text, not the result lines.
        await clearConsole(w);
        await docShot(w, `${SHOT}/5-superposed`);
    });
});

async function selectMol(section: import('@playwright/test').Locator, name: string): Promise<void> {
    // ObjectSelect: a <select> with aria-label "Molecule".
    const sel = section.getByRole('combobox', { name: 'Molecule' }).first();
    const v = await sel.locator('option').filter({ hasText: name }).first().getAttribute('value');
    if (v === null) throw new Error(`no molecule ${name}`);
    await sel.selectOption(v);
}
