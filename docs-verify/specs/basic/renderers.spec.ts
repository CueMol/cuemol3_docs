/**
 * Doc: docs/ja/tutorials/basic/renderers.md (基本操作コース 3 ページ目)
 *
 * Starts from the end state of selection.md (lysozyme Val2-Phe3 selected)
 * and mirrors the page's numbered h2 sections.
 */
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME } from '../../fixtures/course';
import { setupSelectionPage } from '../../fixtures/courseSelection';
import { setupRenderersPage } from '../../fixtures/courseRenderers';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import { clickSceneToolbar, rowVisibilityToggle, sceneRow, sceneToolbarButtons, selectRow } from '../../helpers/sceneTree';
import { setNumericProperty } from '../../helpers/inspector';
import { openSidebarView } from '../../helpers/sidebar';
import { runConsole, clearConsole } from '../../helpers/console';
import { docShot, inspectorRect } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/renderers';
const DOC = 'docs/ja/tutorials/basic/renderers.md';

let harness: CueMolHarness;

async function countOf(w: Page, sel: string): Promise<number> {
    const out = await runConsole(w, `count ${LYSOZYME}, "${sel.replace(/"/g, '\\"')}"`);
    return Number(/atomCount: (\d+)/.exec(out.join('\n'))?.[1] ?? -1);
}

/** Focus a renderer so the molecular view shows the part the step changed. */
async function focusRow(w: Page, name: string): Promise<void> {
    await openSidebarView(w, 'explorer');
    await selectRow(w, name);
    await clickSceneToolbar(w, 'focus');
    await w.waitForTimeout(800);
}

test.describe.serial('Renderer の追加・削除と設定', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
        await setupLoadingPage.run(harness);
        await setupSelectionPage.run(harness.window);
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

    test('1. 選択部分に Renderer を追加する', async () => {
        const w = harness.window;
        await setupRenderersPage.addBallstick(harness.app, w, {
            onDialog: (dlg) => docShot(w, `${SHOT}/1-new-renderer`, { clip: dlg }),
        });
        // 「Create を押すと、Val2〜Phe3 の部分だけが ballstick で表示されます」
        // (addBallstick checks the ballstick1 row and its A.2:3.* range.)
        await focusRow(w, 'ballstick1');
        await docShot(w, `${SHOT}/1-ballstick`);
    });

    test('2. 分子全体に Renderer を追加する', async () => {
        const w = harness.window;
        await setupRenderersPage.addRibbon(harness.app, w);
        // 「シーンツリーで simple1 の目のアイコンを閉じると、図が整理されて見やすくなります」
        await setupRenderersPage.hideSimple(w);
        await expect(rowVisibilityToggle(w, 'simple1')).toHaveClass(/hidden/);
        await openSidebarView(w, 'explorer');
        await selectRow(w, LYSOZYME);
        await clickSceneToolbar(w, 'focus');
        await w.waitForTimeout(800);
        await docShot(w, `${SHOT}/2-layered`);
    });

    test('3. 表示する範囲を後から変える', async () => {
        const w = harness.window;
        // 「1. Mol Struct パネルで残基 2〜7 を範囲選択し、Select atoms を押します」
        // 「2. シーンツリーで ballstick1 を右クリックし、Change sel > Current を選びます」
        await setupRenderersPage.widenBallstick(harness.app, w);
        // 「Renderer の表示範囲が現在の選択に置き換わり、Glu7 まで広がります」
        const out = await runConsole(w, `get ${LYSOZYME}/ballstick1.sel`);
        // "Property\tValue\nlysozyme/ballstick1.sel\t'A'.2:7.*"
        const sel = /\.sel\t(.+)$/m.exec(out.join('\n'))?.[1]?.trim() ?? '';
        expect(await countOf(w, sel)).toBe(await countOf(w, 'A.2:7.*'));
        await clearConsole(w);
        await focusRow(w, 'ballstick1');
        await docShot(w, `${SHOT}/3-widened`);
    });

    test('4. Renderer を削除する', async () => {
        // 「シーンツリーで行を選び、パネル上部の Delete ボタンを押すと削除できます」
        // (ballstick1 is kept, as the page says; only the button is checked.)
        await openSidebarView(harness.window, 'explorer');
        await expect(sceneToolbarButtons(harness.window)).toHaveCount(4);
    });

    test('5. プロパティを調整する', async () => {
        const w = harness.window;
        // 「1. シーンツリーで ballstick1 を選びます」
        await openSidebarView(w, 'explorer');
        await sceneRow(w, 'ballstick1').dblclick();
        // 「3. Bond width と Atom radius を 0.4 にしてみてください」
        await setNumericProperty(w, 'Ball and stick', 'Bond width', 0.4);
        await setNumericProperty(w, 'Ball and stick', 'Atom radius', 0.4);
        // 「4. Show ring を有効にすると、Phe3 の芳香環に板が表示されます」
        const ringLabel = w.getByText('Show ring', { exact: true }).last();
        // The switch row: the innermost element holding both the label and
        // its switch (an inline PropertyField).
        const ringRow = w.locator('div')
            .filter({ has: w.getByText('Show ring', { exact: true }) })
            .filter({ has: w.locator('.h3-form-switch') }).last();
        const ringBox = ringRow.locator('input[type="checkbox"]').first();
        if (!(await ringBox.isChecked())) await ringRow.locator('.h3-form-switch').first().click();
        await expect(ringBox).toBeChecked();
        const radius = w.getByText('Atom radius', { exact: true }).last();
        await docShot(w, `${SHOT}/5-inspector`, {
            rect: await inspectorRect(w, ringLabel, 60),
            highlight: [
                w.getByText('Bond width', { exact: true }).last().locator('xpath=ancestor::*[2]'),
                radius.locator('xpath=ancestor::*[2]'),
                ringRow,
            ],
            mergeHighlight: true,
        });
        await focusRow(w, 'ballstick1');
        await docShot(w, `${SHOT}/5-result`);
    });
});
