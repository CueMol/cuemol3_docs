/**
 * Doc: docs/ja/tutorials/structure/surface-elepot.md (分子表面の静電ポテンシャル表示)
 *
 * The tests mirror the page's numbered h2 sections. APBS and pdb2pqr come
 * from BUNDLE_APPS in the dev build (support/env.ts), as they come from the
 * bundled tree in a packaged build, so no path is set in Settings.
 */
import { test, expect, type Locator } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { expectRow, sceneRow, toggleRowVisibility } from '../../helpers/sceneTree';
import { chooseColoring, colorPane, selectColorTargetOf } from '../../helpers/colorPane';
import { setNumericProperty } from '../../helpers/inspector';
import { openSidebarView } from '../../helpers/sidebar';
import { docShot, inspectorRect, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/structure/surface-elepot';
const DOC = 'docs/ja/tutorials/structure/surface-elepot.md';
const OBJ = '1qio';
const SURF = 'sf_1qio';
const POT = 'pot_1qio';

let harness: CueMolHarness;

/** A SliderField's number box (`.h3-form-sliderfield-row` with its label). */
function sliderNumber(dlg: Locator, label: string): Locator {
    return dlg.locator('.h3-form-sliderfield-row')
        .filter({ has: dlg.page().locator('.h3-form-sliderfield-label', { hasText: label }) })
        .locator('input.h3-form-sliderfield-number').first();
}

/** Target section: Molecule, then "Use selection" with the selection `protein`. */
async function targetProtein(dlg: Locator): Promise<void> {
    await dlg.getByRole('combobox', { name: 'Molecule' }).first().selectOption({ label: OBJ });
    await checkField(dlg, 'Use selection');
    const sel = dlg.getByPlaceholder('* (all atoms)').first();
    await sel.fill('protein');
    await sel.press('Enter');
    await expect(sel).toHaveValue('protein');
}

test.describe.serial('分子表面の静電ポテンシャル表示', { tag: '@net' }, () => {
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
        await getPdb(harness.app, harness.window, { id: '1QIO', rendType: 'cartoon' });
        await expectRow(harness.window, OBJ);
    });

    test('2. 分子表面を生成する', async () => {
        const w = harness.window;
        await clickMenu(harness.app, ['Tools', 'Mol surface generation...']);
        const dlg = dialog(w, 'Mol surface generation');
        await expect(dlg).toBeVisible();
        // 「1. Target の Molecule で 1QIO」「2. Use selection を有効にし、protein」
        await targetProtein(dlg);
        // 「3. Point density (/A) を 5 に上げます」(既定は 2)
        const density = sliderNumber(dlg, 'Point density (/A)');
        await expect(density).toHaveValue(/^2(\.0+)?$/);
        await density.fill('5');
        await density.press('Enter');
        await expect(density).toHaveValue(/^5(\.0+)?$/);
        // 「4. Object name と Probe radius (1.4) は既定のまま」「5. Algorithm も既定の Auto」
        await expect(sliderNumber(dlg, 'Probe radius (A)')).toHaveValue(/^1\.4/);
        await expect(fieldControl(dlg, 'Algorithm')).toHaveValue(/auto/i);
        await docShot(w, `${SHOT}/2-molsurf-dialog`, { clip: dlg });
        // 「6. OK を押すと、分子表面の Object と molsurf Renderer が作られ」
        await dlg.getByRole('button', { name: 'OK', exact: true }).click();
        await expectDialogClosed(w, 'Mol surface generation', 120_000);
        await expectRow(w, SURF, 120_000);
        await expectRow(w, 'molsurf');
        await docShot(w, `${SHOT}/2-surface`);
    });

    test('3. 静電ポテンシャルを計算する', async () => {
        const w = harness.window;
        await clickMenu(harness.app, ['Tools', 'APBS elepot calculation...']);
        const dlg = dialog(w, 'APBS electrostatic potential');
        await expect(dlg).toBeVisible();
        // 「1. Molecule で 1QIO」「2. Use selection を有効にし、protein」
        await targetProtein(dlg);
        // 「4. Charge method の Method は既定の Use PDB2PQR のまま」
        await expect(fieldControl(dlg, 'Method')).toContainText(/PDB2PQR/i);
        // 「5. Start を押すと、pdb2pqr → apbs の順に計算が走り、進捗が表示されます」
        const start = dlg.getByRole('button', { name: 'Start', exact: true });
        await expect(start).toBeEnabled();
        await start.click();
        await expect(dlg.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
        await docShot(w, `${SHOT}/3-apbs-running`, { clip: dlg });
        await expectDialogClosed(w, 'APBS electrostatic potential', 300_000);
        await expectRow(w, POT, 60_000);
        // 「マップが計算された範囲を示す枠 (unitcell) も追加されます」— hidden here.
        await toggleRowVisibility(w, 'unitcell');
    });

    test('4. 表面を静電ポテンシャルで着色する', async () => {
        const w = harness.window;
        // 「1. Color パネル」「2. molsurf の Renderer を選びます」
        await openSidebarView(w, 'explorer');
        await selectColorTargetOf(w, SURF, 'molsurf');
        // 「3. Coloring の種類から Electrostatic potential を選びます」
        await chooseColoring(harness.app, w, ['Electrostatic potential']);
        const pane = colorPane(w);
        // 「4. Potential で、手順 3 で作った静電ポテンシャルマップを選びます」
        await fieldControl(pane, 'Potential').selectOption({ label: POT });
        // 「5. By SAS を有効にします」
        const sas = pane.locator('.color-field-row').filter({ hasText: 'By SAS' }).locator('input[type="checkbox"]');
        if (!(await sas.isChecked())) await sas.click();
        await expect(sas).toBeChecked();
        // 「6. High を 2、Low を -2 程度にします」(既定は ±10)
        for (const [label, v] of [['High', '2'], ['Low', '-2']] as const) {
            const input = pane.locator('.color-elepot-ramp-row')
                .filter({ has: w.locator('.color-elepot-ramp-label', { hasText: new RegExp(`^${label}$`) }) })
                .locator('input').first();
            await expect(input).toHaveValue(label === 'High' ? /^10/ : /^-10/);
            await input.fill(v);
            await input.press('Enter');
            await expect(input).toHaveValue(new RegExp(`^${v}`));
        }
        await docShot(w, `${SHOT}/4-color-pane`, {
            rect: await sidebarRect(w, pane, 10),
            highlight: pane,
        });
        await docShot(w, `${SHOT}/4-colored`);
    });

    test('5. 半透明の表面と cartoon を重ねる', async () => {
        const w = harness.window;
        // 「1. シーンツリーで molsurf の Renderer を選びます」
        await openSidebarView(w, 'explorer');
        await sceneRow(w, 'molsurf').dblclick();
        // 「2. Basic settings セクションで Opacity を 0.5 前後に下げます」
        await setNumericProperty(w, 'Basic settings', 'Opacity', 0.5);
        const label = w.getByText('Opacity', { exact: true }).last();
        await docShot(w, `${SHOT}/5-opacity`, {
            rect: await inspectorRect(w, label, 60),
            highlight: label.locator('xpath=ancestor::*[2]'),
        });
        await docShot(w, `${SHOT}/5-translucent`);
    });
});
