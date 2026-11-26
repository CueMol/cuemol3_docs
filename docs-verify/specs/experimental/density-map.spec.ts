/**
 * Doc: docs/ja/tutorials/experimental/density-map.md (電子密度マップの表示)
 *
 * The tests mirror the page's numbered h2 sections. §5 only points to the
 * publication-images page, so it has no test.
 */
import { test, expect, type Locator } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { checkField } from '../../helpers/form';
import { clickSceneToolbar, expectRow, rowVisibilityToggle, selectRow, toggleRowVisibility } from '../../helpers/sceneTree';
import { densityPane, levelInput, selectMapRenderer, setDragRow, setLevel } from '../../helpers/densityPane';
import { molStructPane, setupSelectionPage } from '../../fixtures/courseSelection';
import { setViewValue, viewValueText } from '../../helpers/viewPane';
import { openSidebarView } from '../../helpers/sidebar';
import { runConsole, clearConsole } from '../../helpers/console';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/experimental/density-map';
const DOC = 'docs/ja/tutorials/experimental/density-map.md';
const OBJ = '1qio';

let harness: CueMolHarness;

/** Tick a Get PDB checkbox by its label (a CheckboxField or a bare checkbox). */
async function tick(dlg: Locator, label: string): Promise<void> {
    try {
        await checkField(dlg, label);
    } catch {
        const box = dlg.getByRole('checkbox', { name: label });
        if (!(await box.isChecked())) await box.check({ force: true });
    }
}

test.describe.serial('電子密度マップの表示', { tag: '@net' }, () => {
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

    test('1. 座標と密度マップをまとめて取得する', async () => {
        const w = harness.window;
        await getPdb(harness.app, w, {
            id: '1QIO',
            rendType: 'simple',
            onGetPdbDialog: async (dlg) => {
                // 「2. Fetch coordinates に加えて、2Fo-Fc map と Fo-Fc map にもチェック」
                await expect(dlg.getByText('Fetch coordinates', { exact: true })).toBeVisible();
                await tick(dlg, '2Fo-Fc map');
                await tick(dlg, 'Fo-Fc map');
                // 「3. マップの取得元は既定の RCSB (cif.gz)」
                await expect(dlg).toContainText('RCSB (cif.gz)');
                await docShot(w, `${SHOT}/1-getpdb`, { clip: dlg });
            },
        });
        // 「マップには Renderer 指定の画面は出ず、次の構成で自動的に表示されます」
        await expectRow(w, OBJ);
        await expectRow(w, '1qio_2fofc', 60_000);
        await expectRow(w, '1qio_fofc', 60_000);
        const out = await runConsole(w, 'list_map_contours');
        const text = out.join('\n');
        console.log(`[density-map] ${text}`);
        for (const r of ['1qio_2fofc/contour1', '1qio_fofc/pos-cont', '1qio_fofc/neg-cont']) {
            expect(text).toContain(r);
        }
        await clearConsole(w);
    });

    test('2. 表示を確認する', async () => {
        const w = harness.window;
        await openSidebarView(w, 'explorer');
        // 「目のアイコンで個別に表示・非表示を切り替えられます」
        await expect(rowVisibilityToggle(w, '1qio_2fofc')).toBeVisible();
        await docShot(w, `${SHOT}/2-loaded`);
        // 「シーンツリーで 1qio を選んでパネル上部の Focus を押し、Density map パネルで
        //   各 Renderer の Redraw を押して、マップを分子の位置に描き直します」
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await w.waitForTimeout(800);
        const pane = await densityPane(w);
        for (const r of ['contour1', 'pos-cont', 'neg-cont']) {
            await selectMapRenderer(pane, r);
            await pane.getByRole('button', { name: 'Redraw', exact: true }).click();
        }
        await openSidebarView(w, 'explorer');
        await docShot(w, `${SHOT}/2-redrawn`);
    });

    test('3. レベルと範囲を調整する', async () => {
        const w = harness.window;
        const pane = await densityPane(w);
        // 「1. 上部で対象の Renderer (1qio_2fofc/contour1 など) を選びます」
        await selectMapRenderer(pane, 'contour1');
        // 既定は σ 単位で +1.0
        expect(Number(await levelInput(pane).inputValue())).toBeCloseTo(1.0, 1);
        // 「ここでは 2Fo-Fc の Level を 1.5 にします」
        await setLevel(pane, 1.5);
        // 「3. Extent」「4. Transp」
        await expect(pane.getByText('Extent', { exact: true })).toBeVisible();
        await expect(pane.getByText('Transp', { exact: true })).toBeVisible();
        await docShot(w, `${SHOT}/3-density-pane`, {
            rect: await sidebarRect(w, pane, 10),
            highlight: levelInput(pane),
        });
    });

    test('4. 注目部位に絞って表示する', async () => {
        const w = harness.window;
        // 「1. Mol Struct パネルで残基 35 と 52 を選び、Zoom at を押します」
        await setupSelectionPage.unfoldMolStruct(w);
        const pane = molStructPane(w);
        await pane.getByRole('combobox', { name: 'Molecule' }).selectOption({ label: OBJ });
        const tree = pane.locator('.mol-tree');
        const chain = tree.locator('.bp5-tree-node-content').filter({ hasText: /^chain "A"/ }).first();
        const r35 = tree.locator('.bp5-tree-node-content').filter({ hasText: /^35 GLU$/ }).first();
        if (!(await r35.isVisible().catch(() => false))) await chain.locator('.h3-tree-caret').click();
        await r35.scrollIntoViewIfNeeded();
        await r35.click();
        const r52 = tree.locator('.bp5-tree-node-content').filter({ hasText: /^52 ASP$/ }).first();
        await r52.scrollIntoViewIfNeeded();
        await r52.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] });
        await pane.locator('.section-action-btn').nth(2).click();
        await w.waitForTimeout(800);
        // 「2. Extent を 10 Å 程度まで下げて」
        const dpane = await densityPane(w);
        for (const r of ['contour1', 'pos-cont', 'neg-cont']) {
            await selectMapRenderer(dpane, r);
            await setDragRow(dpane, 'Extent', 10);
            // 「3. ... パネルの Redraw で表示中心を現在のビュー中心に更新」
            await dpane.getByRole('button', { name: 'Redraw', exact: true }).click();
        }
        // 「4. Slab を 8 Å 程度に狭めると」
        await openSidebarView(w, 'explorer');
        await setViewValue(w, 'Slab', 8);
        expect(await viewValueText(w, 'Slab')).toMatch(/^8/);
        // The selection highlight would cover the side chains.
        await runConsole(w, `set_mol_selection ${OBJ}, ""`);
        await clearConsole(w);
        await docShot(w, `${SHOT}/4-active-site`);
        // 「1qio_2fofc の目のアイコンを閉じて 2Fo-Fc を一時的に隠すと」
        await toggleRowVisibility(w, '1qio_2fofc');
        await expect(rowVisibilityToggle(w, '1qio_2fofc')).toHaveClass(/hidden/);
        await docShot(w, `${SHOT}/4-fofc-only`);
    });
});
