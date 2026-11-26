/**
 * Doc: docs/ja/tutorials/experimental/cryoem-map.md (cryo-EM マップとモデルの表示)
 *
 * The tests mirror the page's numbered h2 sections. The map is about 28 MB,
 * so the download step allows several minutes.
 */
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed } from '../../helpers/dialogs';
import { expectRow, selectRow, clickSceneToolbar, toggleRowVisibility, rowContextMenu } from '../../helpers/sceneTree';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { runConsole, clearConsole } from '../../helpers/console';
import { densityPane, levelInput, selectMapRenderer, setDragRow, setLevel } from '../../helpers/densityPane';
import { setViewValue } from '../../helpers/viewPane';
import { openSidebarView } from '../../helpers/sidebar';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/experimental/cryoem-map';
const DOC = 'docs/ja/tutorials/experimental/cryoem-map.md';
const MAP_TIMEOUT_MS = 300_000;

let harness: CueMolHarness;

test.describe.serial('cryo-EM マップとモデルの表示', { tag: '@net' }, () => {
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

    test('1. マップとモデルを取得する', async () => {
        test.setTimeout(MAP_TIMEOUT_MS + 60_000);
        const w = harness.window;
        await clickMenu(harness.app, ['File', 'Get PDB...']);
        const dlg = dialog(w, 'Get PDB');
        await expect(dlg).toBeVisible();
        await dlg.locator('#get-pdb-id').fill('5IRZ');
        // 「Coordinates と Cryo-EM maps の項目が表示されます」
        await expect(dlg).toContainText('Cryo-EM maps', { timeout: 60_000 });
        // 「Fetch coordinates が ON」「EMD-8118 map が ON」
        await expect(fieldRowCheckbox(dlg, 'Fetch coordinates')).toBeChecked();
        await expect(fieldRowCheckbox(dlg, 'EMD-8118 map')).toBeChecked();
        // 「行の下に、ファイルのサイズ (約 28 MB)・格子の大きさ (各辺 192)・推奨レベルが
        //   表示されます」. Wait for it: Download before the EMDB record is read
        //   falls back to the top 1 % instead of the recommended level.
        await expect(dlg).toContainText(/recommended level 4(\.0+)?(?![0-9.])/, { timeout: 60_000 });
        await expect(dlg).toContainText('192');
        await docShot(w, `${SHOT}/1-getpdb`, { clip: dlg });
        await clickDialogButton(w, 'Get PDB', 'Download');
        const options = dialog(w, 'Open File Options');
        await expect(options).toBeVisible({ timeout: MAP_TIMEOUT_MS });
        await fieldControl(options, 'Renderer type').selectOption('cartoon');
        await options.getByRole('button', { name: 'Open', exact: true }).click();
        await expectDialogClosed(w, 'Open File Options');
        // 「モデルは 5irz、マップは emd_8118 という名前の Object になります」
        await expectRow(w, '5irz', MAP_TIMEOUT_MS);
        await expectRow(w, 'emd_8118', MAP_TIMEOUT_MS);
        await expectRow(w, 'isosurf');
        await expectDialogClosed(w, /Downloading/, MAP_TIMEOUT_MS);
        await docShot(w, `${SHOT}/1-loaded`);
    });

    test('2. レベルの単位を上位 % にする', async () => {
        const w = harness.window;
        const pane = await densityPane(w);
        await selectMapRenderer(pane, 'emd_8118/isosurf');
        // 「Level の入力欄は 4 前後」(absolute at load)
        const abs = Number(await levelInput(pane).inputValue());
        expect(abs).toBeGreaterThan(3.8);
        expect(abs).toBeLessThan(4.5);
        // 「▼ を押し、Use top-percent contour level を選びます」
        await pane.getByRole('button', { name: 'Level mode' }).click();
        const item = w.locator('.bp5-menu').getByText('Use top-percent contour level', { exact: true });
        await expect(item).toBeVisible();
        await docShot(w, `${SHOT}/2-level-mode`, {
            rect: await sidebarRect(w, w.locator('.bp5-menu'), 40),
            highlight: item,
        });
        await item.click();
        // 「入力欄が上位 % の値になります」(about 0.9)
        await expect.poll(async () => Number(await levelInput(pane).inputValue())).toBeLessThan(1.5);
        console.log(`[cryoem] level at load: abs ${abs}, top-percent ${await levelInput(pane).inputValue()}`);
    });

    test('3. マップ全体でレベルを変えてみる', async () => {
        const w = harness.window;
        const pane = await densityPane(w);
        await setLevel(pane, 3);
        await docShot(w, `${SHOT}/3-level-3`);
        await setLevel(pane, 0.9);
        await docShot(w, `${SHOT}/3-level-0.9`);
    });

    test('4. 短い範囲で側鎖の密度を見る', async () => {
        const w = harness.window;
        await openSidebarView(w, 'explorer');
        // 1. New Renderer ballstick, Atoms B.660:672.*
        await rowContextMenu(harness.app, w, '5irz', ['New Renderer…']);
        const dlg = dialog(w, 'New Renderer');
        await expect(dlg).toBeVisible();
        await fieldControl(dlg, 'Renderer type').selectOption('ballstick');
        await checkField(dlg, 'Selection');
        await dlg.getByPlaceholder('* (all atoms)').fill('B.660:672.*');
        await clickDialogButton(w, 'New Renderer', 'Create');
        await expectDialogClosed(w, 'New Renderer');
        await expectRow(w, 'ballstick1');
        // 2. cartoon1 の目のアイコンを閉じる
        await toggleRowVisibility(w, 'cartoon1');
        // 3. ballstick1 を選び Focus
        await selectRow(w, 'ballstick1');
        await clickSceneToolbar(w, 'focus');
        // 4. View パネルで Slab に 10
        await setViewValue(w, 'Slab', 10);
        // 5. Density map パネルの Transp を 0.5 前後に
        const pane = await densityPane(w);
        await setDragRow(pane, 'Transp', 0.5);
        // For the figures: turn so the helix is seen from the side (the page
        // asks the reader to do this by dragging).
        await runConsole(w, 'rotate_view x, 90');
        await runConsole(w, 'set_view slab=10');
        await clearConsole(w);
        for (const lv of [0.3, 0.9, 3]) {
            await setLevel(pane, lv);
            await docShot(w, `${SHOT}/4-level-${lv}`, {
                rect: await canvasRect(w),
            });
        }
        await setLevel(pane, 0.9);
    });
});

function fieldRowCheckbox(scope: import('@playwright/test').Locator, label: string) {
    return scope.locator('.h3-form-field-row')
        .filter({ has: scope.page().locator('.h3-form-field-label', { hasText: new RegExp(`^${label}$`) }) })
        .first().locator('input[type="checkbox"]');
}

/** The molecular view's canvas area (for the side-chain comparison figures). */
async function canvasRect(w: import('@playwright/test').Page) {
    // The largest canvas is the molecular view (the Density map pane's
    // histogram is a canvas too).
    const boxes = [];
    for (const c of await w.locator('canvas').all()) {
        const b = await c.boundingBox();
        if (b) boxes.push(b);
    }
    const b = boxes.sort((p, q) => q.width * q.height - p.width * p.height)[0];
    return { x: b.x, y: b.y, width: b.width, height: b.height };
}
