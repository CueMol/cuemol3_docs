/**
 * Doc: docs/ja/getting-started/quick-tour.md
 *
 * The five tests below map 1:1 onto the page's numbered h2 sections; each
 * test.step carries the section wording so the two can be diffed by grep.
 * Update this spec whenever the page changes (and vice versa).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import { CueMolHarness } from '../fixtures/app';
import { artifacts } from '../support/env';
import { clickMenu } from '../helpers/menu';
import {
    assertDialogQueuesEmpty,
    clickDialogButton,
    dialog,
    expectDialogClosed,
    expectSaveDialog,
} from '../helpers/dialogs';
import { expectRow, selectRow, openInInspector, clickSceneToolbar } from '../helpers/sceneTree';
import { setNumericProperty } from '../helpers/inspector';
import { selectColorTarget, chooseColoring } from '../helpers/colorPane';
import { rotateView, zoomView } from '../helpers/molView';
import { docShot } from '../helpers/docShot';

const NET_TIMEOUT_MS = 60_000;
const PDB_ID = '1CRN';
const OBJ_NAME = PDB_ID.toLowerCase();

let harness: CueMolHarness;

async function waitForFile(path: string, timeoutMs = 15_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (fs.existsSync(path) && fs.statSync(path).size > 0) return;
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`[docs-verify] file did not appear: ${path}`);
}

test.describe.serial('クイックツアー', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
    });

    test.afterAll(async () => {
        await assertDialogQueuesEmpty(harness.app);
        await harness.close();
    });

    test.afterEach(async ({}, testInfo) => {
        testInfo.annotations.push({ type: 'doc', description: 'docs/ja/getting-started/quick-tour.md' });
        if (testInfo.status !== testInfo.expectedStatus && harness) {
            await testInfo.attach('app-log', { body: harness.logs.text(), contentType: 'text/plain' });
            try {
                await testInfo.attach('window', {
                    body: await harness.window.screenshot(),
                    contentType: 'image/png',
                });
            } catch { /* window may be gone */ }
        }
    });

    test('1. 起動する', async () => {
        // 「CueMol3 を起動すると単一のウィンドウが開きます。」
        await expect(harness.window.locator('canvas').first()).toBeVisible();
        await docShot(harness.window, 'getting-started/quick-tour/1-startup');
    });

    test('2. 構造を読み込む', async () => {
        await test.step('File > Get PDB... で取得する', async () => {
            await clickMenu(harness.app, ['File', 'Get PDB...']);
            const dlg = dialog(harness.window, 'Get PDB');
            await expect(dlg).toBeVisible();
            await dlg.locator('#get-pdb-id').fill(PDB_ID);
            await docShot(harness.window, 'getting-started/quick-tour/2-getpdb');
            await clickDialogButton(harness.window, 'Get PDB', 'Download');
        });

        await test.step('読み込み時に Renderer の種類を選ぶ画面が出ます', async () => {
            const options = dialog(harness.window, 'Open File Options');
            await expect(options).toBeVisible({ timeout: NET_TIMEOUT_MS });
            await options.locator('#rend-type').selectOption('simple');
            await options.getByRole('button', { name: 'Open', exact: true }).click();
            await expectDialogClosed(harness.window, 'Open File Options');
            await expectDialogClosed(harness.window, /Downloading/);
        });

        // Get PDB derives the object name from the downloaded file (lowercase id).
        await expectRow(harness.window, OBJ_NAME);
        await expectRow(harness.window, 'simple1');
    });

    test('3. 表示を整える', async () => {
        await test.step('Renderer を追加する', async () => {
            // Docs: シーンツリーで Object を右クリック → New Renderer。
            // The tree context menu is a native Menu (main process), which
            // Playwright cannot click; the Scene panel toolbar's Add button
            // opens the same New Renderer flow, so the dialog contents are
            // still verified end-to-end.
            await selectRow(harness.window, OBJ_NAME);
            await clickSceneToolbar(harness.window, 'add');
            const dlg = dialog(harness.window, 'New Renderer');
            await expect(dlg).toBeVisible();
            await dlg.locator('#rend-type').selectOption('ballstick');
            await clickDialogButton(harness.window, 'New Renderer', 'Create');
            await expectDialogClosed(harness.window, 'New Renderer');
            await expectRow(harness.window, 'ballstick1');
        });

        await test.step('見た目を調整する', async () => {
            // 「値を変えると分子ビューに即座に反映されます。」— round-trips a
            // ballstick property through the inspector (opened by
            // double-clicking the tree row, as the side-panels page states).
            await openInInspector(harness.window, 'ballstick1');
            await setNumericProperty(harness.window, 'Ball and stick', 'Bond width', 0.4);
        });

        await test.step('色は Explorer > Color から切り替える', async () => {
            await selectColorTarget(harness.window, `ballstick1 (ballstick)`);
            await chooseColoring(harness.window, 'CPK coloring');
        });

        await test.step('視点を動かす', async () => {
            await rotateView(harness.window);
            await zoomView(harness.window);
            await expect(harness.window.locator('canvas').first()).toBeVisible();
        });
    });

    test('4. 画像を書き出す', async () => {
        await test.step('手軽に画面のまま出す', async () => {
            const pngPath = artifacts('quick-tour', 'export.png');
            fs.rmSync(pngPath, { force: true });
            await expectSaveDialog(harness.app, pngPath);
            await clickMenu(harness.app, ['Rendering', 'Export scene', 'PNG image...']);
            await expect(dialog(harness.window, 'PNG options')).toBeVisible();
            await clickDialogButton(harness.window, 'PNG options', 'OK');
            await expectDialogClosed(harness.window, 'PNG options');
            await waitForFile(pngPath);
            const head = fs.readFileSync(pngPath).subarray(0, 4);
            expect([...head]).toEqual([0x89, 0x50, 0x4e, 0x47]);
        });

        await test.step('高品位なレイトレース画像を出す', async () => {
            await clickMenu(harness.app, ['Rendering', 'Image rendering...']);
            // The rendering window is a separate BrowserWindow with its own
            // entry (render.html).
            await expect
                .poll(() => harness.app.windows().some((w) => w.url().includes('render.html')), { timeout: 15_000 })
                .toBe(true);
            const renderWindow = harness.app.windows().find((w) => w.url().includes('render.html'))!;
            await docShot(renderWindow, 'getting-started/quick-tour/4-rendering-window');

            if (process.env.E2E_SLOW) {
                // 「2. 画質・サイズを設定する」— the default Lighting is
                // Global Illumination; pick Raytrace only so the slow step
                // stays light and deterministic.
                await renderWindow.getByRole('radio', { name: 'Render', exact: true }).click();
                await renderWindow
                    .getByText('Lighting', { exact: true })
                    .locator('xpath=following::select[1]')
                    .selectOption({ label: 'Raytrace only' });
                await renderWindow.getByRole('button', { name: 'Start Render', exact: true }).click();
                // The result viewer shows the rendered image when the job is done.
                await expect(renderWindow.getByAltText('Render result')).toBeVisible({ timeout: 600_000 });
            } else {
                test.info().annotations.push({
                    type: 'skipped-step',
                    description: '§4 Start Render によるレイトレース実行 (E2E_SLOW=1 で有効)',
                });
            }

            // The window is modeless; close it to return to the main flow.
            await renderWindow.close();
        });
    });

    test('5. シーンを保存する', async () => {
        const qscPath = artifacts('quick-tour', 'tour.qsc');
        fs.rmSync(qscPath, { force: true });
        await expectSaveDialog(harness.app, qscPath);
        await clickMenu(harness.app, ['File', 'Save Scene']);
        await expect(dialog(harness.window, 'Scene options')).toBeVisible();
        await clickDialogButton(harness.window, 'Scene options', 'OK');
        await expectDialogClosed(harness.window, 'Scene options');
        await waitForFile(qscPath);
    });
});
