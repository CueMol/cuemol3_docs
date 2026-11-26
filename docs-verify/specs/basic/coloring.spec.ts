/**
 * Doc: docs/ja/tutorials/basic/coloring.md (基本操作コース 4 ページ目)
 *
 * Starts from the end state of renderers.md (lysozyme: simple1 hidden,
 * ballstick1 on Val2-Glu7, ribbon1; 1g59: trace1) and mirrors the page's
 * numbered h2 sections.
 *
 * The coloring-type menu is a native menu on macOS; the popup-menu stub
 * picks the item the page names (helpers/colorPane.ts chooseColoring).
 */
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME, SECOND_OBJ } from '../../fixtures/course';
import { setupRenderersPage } from '../../fixtures/courseRenderers';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import {
    addPaintRowAtTop, chooseColoring, colorPane, coloringButton, paintRow, paintRowAction,
    paintSelections, selectColorTargetOf, setPaintRowColor,
} from '../../helpers/colorPane';
import { lastPopupLabels } from '../../helpers/popupMenu';
import { rowVisibilityToggle, selectRow, toggleRowVisibility } from '../../helpers/sceneTree';
import { fieldControl } from '../../helpers/form';
import { openSidebarView } from '../../helpers/sidebar';
import { runConsole, clearConsole } from '../../helpers/console';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/coloring';
const DOC = 'docs/ja/tutorials/basic/coloring.md';

let harness: CueMolHarness;

/**
 * Fit the view with the console's focus command: selecting a tree row and
 * pressing Focus would also retarget the Color pane to that row.
 */
async function focusRow(w: Page, target: string): Promise<void> {
    await runConsole(w, `focus ${target}`);
    await clearConsole(w);
    await w.waitForTimeout(800);
}

test.describe.serial('Renderer の着色', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
        await setupLoadingPage.run(harness);
        await setupRenderersPage.run(harness);
        // The selection highlight left by the previous pages would sit on
        // top of the colours this page is about.
        await runConsole(harness.window, `set_mol_selection ${LYSOZYME}, ""`);
        await clearConsole(harness.window);
        // Fold the Camera pane so the Color pane's decks show in full.
        await openSidebarView(harness.window, 'explorer');
        // (The header's centre is over its buttons, which do not toggle it.)
        await harness.window.locator('.sp-pane.camera-pane .section-title').first().click();
        await expect(harness.window.getByText('__current', { exact: true })).toHaveCount(0);
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

    test('1. Color パネルの使い方', async () => {
        const w = harness.window;
        await openSidebarView(w, 'explorer');
        const pane = colorPane(w);
        // 「1. 上部で操作対象の Renderer を選びます (シーンツリーで Renderer を選ぶと、ここも追従します)」
        await selectRow(w, 'ballstick1');
        const target = pane.locator('select').first();
        await expect(target.locator('option:checked')).toHaveText(/ballstick1/);
        await docShot(w, `${SHOT}/1-color-pane`, {
            rect: await sidebarRect(w, pane, 10),
            highlight: [target, coloringButton(w)],
        });
    });

    test('2. CPK — 元素ごとの色', async () => {
        const w = harness.window;
        const pane = colorPane(w);
        // 「1. 対象に lysozyme/ballstick1 を選びます」
        await selectColorTargetOf(w, LYSOZYME, 'ballstick1');
        // 「2. Coloring の種類から CPK coloring を選びます」
        await chooseColoring(harness.app, w, ['CPK coloring']);
        expect(await lastPopupLabels(harness.app)).toContain('CPK coloring');
        await expect(coloringButton(w)).toContainText('CPK');
        // 「3. Carbon (炭素) の色を灰色 (例: #808080) に変えてみてください」
        // FieldGrid row: the label cell, then the colour field (swatch + text box).
        const carbonLabel = pane.getByText('Carbon', { exact: true }).first();
        const input = pane.locator('input[type="text"], input:not([type])')
            .filter({ hasNot: w.locator('xpath=self::*[@disabled]') }).first();
        await input.fill('#808080');
        await input.press('Enter');
        await input.press('Escape').catch(() => {});
        await expect(input).toHaveValue(/808080/i);
        await docShot(w, `${SHOT}/2-cpk`, {
            rect: await sidebarRect(w, pane, 10),
            highlight: [carbonLabel, input],
            mergeHighlight: true,
        });
        await focusRow(w, `${LYSOZYME}/ballstick1`);
        await docShot(w, `${SHOT}/2-cpk-view`);
    });

    test('3. B-factor — 値に応じたグラデーション', async () => {
        const w = harness.window;
        // 「1. 対象に lysozyme/simple1 を選びます (非表示にしていた場合は目のアイコンで戻します)」
        await openSidebarView(w, 'explorer');
        if (/hidden/.test((await rowVisibilityToggle(w, 'simple1').getAttribute('class')) ?? '')) {
            await toggleRowVisibility(w, 'simple1');
        }
        await selectColorTargetOf(w, LYSOZYME, 'simple1');
        // 「2. Coloring の種類から Bfac/Occ coloring を選びます」
        await chooseColoring(harness.app, w, ['Bfac/Occ coloring']);
        // 「下限・上限の色と値の範囲 (Auto / Manual) も設定できます」
        const pane = colorPane(w);
        await expect(fieldControl(pane, 'Low')).toBeVisible();
        await expect(fieldControl(pane, 'High')).toBeVisible();
        await expect(fieldControl(pane, 'Auto')).toBeVisible();
        await focusRow(w, LYSOZYME);
        await docShot(w, `${SHOT}/3-bfac`);
    });

    test('4. Rainbow — 端から端への虹色', async () => {
        const w = harness.window;
        const pane = colorPane(w);
        // 「1. 対象に 1g59/trace1 を選びます」
        await selectColorTargetOf(w, SECOND_OBJ, 'trace1');
        // 「2. Coloring の種類から Rainbow coloring を選びます」
        await chooseColoring(harness.app, w, ['Rainbow coloring']);
        // 「3. Mode を Molecule から Chain に切り替えます」
        const mode = fieldControl(pane, 'Mode');
        await expect(mode).toHaveValue('mol');
        await mode.selectOption('chain');
        await expect(mode).toHaveValue('chain');
        // 「1G59 はタンパク質と tRNA が別のチェイン」
        const chains = await runConsole(w, `list_chains ${SECOND_OBJ}`);
        expect(chains.join('\n')).toMatch(/A[\s\S]*B/);
        await clearConsole(w);
        await docShot(w, `${SHOT}/4-rainbow-mode`, {
            rect: await sidebarRect(w, pane, 10),
            highlight: mode,
        });
        await focusRow(w, SECOND_OBJ);
        await docShot(w, `${SHOT}/4-rainbow`);
    });

    test('5. Paint — 選択と色の組で塗り分ける', async () => {
        const w = harness.window;
        // 「1. 対象に lysozyme/ribbon1 を選びます」
        await selectColorTargetOf(w, LYSOZYME, 'ribbon1');
        // 「2. Paint coloring > Okabe-Ito > Orange を選びます ... sheet / helix / nucleic / * の 4 行」
        await chooseColoring(harness.app, w, ['Paint coloring', 'Okabe-Ito', 'Orange']);
        await expect.poll(() => paintSelections(w)).toEqual(['sheet', 'helix', 'nucleic', '*']);
        // 「3. 表を次の 3 行に書き換えます (上から順) helix 薄い青 / sheet 緑 / * 白系」
        await paintRowAction(w, 'nucleic', 'Delete row');
        await paintRowAction(w, 'helix', 'Move row up');
        await expect.poll(() => paintSelections(w)).toEqual(['helix', 'sheet', '*']);
        await setPaintRowColor(w, 'helix', '#56B4E9');
        await setPaintRowColor(w, 'sheet', '#009E73');
        await setPaintRowColor(w, '*', '#F0F0F0');

        await test.step('塗りを追加する', async () => {
            // 「1. 表の一番上に行を追加します」「2. 選択式に A.119:129.*、色に赤を指定します」
            await addPaintRowAtTop(w, 'A.119:129.*', '#FF0000');
            await expect.poll(() => paintSelections(w)).toEqual(['A.119:129.*', 'helix', 'sheet', '*']);
            await expect(paintRow(w, 'A.119:129.*')).toBeVisible();
            // add_paint style edits select the painted range; clear it so the
            // highlight does not cover the red helix in the figure.
            await runConsole(w, `set_mol_selection ${LYSOZYME}, ""`);
            await clearConsole(w);
            const pane = colorPane(w);
            await docShot(w, `${SHOT}/5-paint-table`, {
                rect: await sidebarRect(w, pane, 10),
                highlight: w.locator('.color-row').first(),
            });
            // Only the ribbon, so the colours read cleanly.
            await openSidebarView(w, 'explorer');
            await toggleRowVisibility(w, 'simple1');
            await toggleRowVisibility(w, 'ballstick1');
            await focusRow(w, LYSOZYME);
            await docShot(w, `${SHOT}/5-paint`);
        });
    });
});
