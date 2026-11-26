/**
 * Doc: docs/ja/tutorials/figures/publication-images.md (論文用の高解像度画像の書き出し)
 *
 * The tests mirror the page's numbered h2 sections. The page starts from the
 * finished ribbon-figure scene but works on any scene, so §1 builds a short
 * version of it (3UG9 cartoon, white background, edge lines). The raytrace
 * in §3 and the result in §4 run with E2E_SLOW=1 (task e2e:slow / e2e:shots).
 */
import * as fs from 'node:fs';
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { artifacts } from '../../support/env';
import {
    assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed, expectSaveDialog,
} from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { fieldControl, setSwitchField } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import { clickSceneToolbar, expectRow, rowContextMenu, selectRow } from '../../helpers/sceneTree';
import { openSidebarView } from '../../helpers/sidebar';
import {
    openRenderWindow, settingSelect, showSettingsTab, startRender, startRenderButton,
} from '../../helpers/renderWindow';
import { aroundBox, docShot, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/figures/publication-images';
const DOC = 'docs/ja/tutorials/figures/publication-images.md';
const OBJ = '3ug9';

let harness: CueMolHarness;
let rw: Page;

async function waitForFile(p: string, timeoutMs = 30_000): Promise<void> {
    await expect.poll(() => fs.existsSync(p) && fs.statSync(p).size > 0, { timeout: timeoutMs }).toBe(true);
}

/** Width, height and the pHYs pixels-per-metre of a PNG file. */
function pngInfo(p: string): { width: number; height: number; ppm?: number } {
    const buf = fs.readFileSync(p);
    expect([...buf.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    const info: { width: number; height: number; ppm?: number } = {
        width: buf.readUInt32BE(16), height: buf.readUInt32BE(20),
    };
    for (let off = 8; off < buf.length;) {
        const len = buf.readUInt32BE(off);
        const type = buf.toString('latin1', off + 4, off + 8);
        if (type === 'pHYs') info.ppm = buf.readUInt32BE(off + 8);
        if (type === 'IDAT') break;
        off += 12 + len;
    }
    return info;
}

test.describe.serial('論文用の高解像度画像の書き出し', { tag: '@net' }, () => {
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

    test('1. 2 つの出力方法と使い分け', async () => {
        const w = harness.window;
        // The ribbon-figure scene, shortened: cartoon, white background, edge lines.
        await getPdb(harness.app, w, { id: '3UG9', rendType: 'cartoon' });
        await expectRow(w, OBJ);
        await openSidebarView(w, 'explorer');
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await clickMenu(harness.app, ['Scene', 'Background', 'White']);
        await rowContextMenu(harness.app, w, 'cartoon1', ['Style', 'Edge line (normal)']);
        await w.waitForTimeout(800);
    });

    test('2. 画面のまま PNG に書き出す', async () => {
        const w = harness.window;
        const png = artifacts('publication-images', 'export.png');
        fs.rmSync(png, { force: true });
        // 「Rendering > Export scene > PNG image... を選ぶと、保存先の指定に続いてオプション画面が出ます」
        await expectSaveDialog(harness.app, png);
        await clickMenu(harness.app, ['Rendering', 'Export scene', 'PNG image...']);
        const dlg = dialog(w, 'PNG options');
        await expect(dlg).toBeVisible();
        // 「サイズと解像度 (DPI) を指定できます」: 1200 x 1200 pixels at 600 DPI.
        await fieldControl(dlg, 'Resolution (DPI)').selectOption('600');
        await fieldControl(dlg, 'Unit').selectOption({ label: 'pixel' });
        await setSwitchField(dlg, 'Retain aspect ratio', false);
        for (const label of ['Width', 'Height']) {
            const input = fieldControl(dlg, label);
            await input.fill('1200');
            await input.press('Enter');
        }
        await expect(dlg).toContainText('Pixel size: 1200 x 1200');
        // 「背景の透過を有効にすると、背景が透明な PNG になります」
        await setSwitchField(dlg, 'Transparent PNG', true);
        await docShot(w, `${SHOT}/2-png-options`, { clip: dlg });
        await clickDialogButton(w, 'PNG options', 'OK');
        await expectDialogClosed(w, 'PNG options');
        await waitForFile(png);
        // 「DPI は画像のピクセル数には影響しません ... 紙面上の実寸を決める値です」
        const info = pngInfo(png);
        expect([info.width, info.height]).toEqual([1200, 1200]);
        expect(Math.round((info.ppm ?? 0) * 0.0254)).toBe(600);
    });

    test('3. レイトレースで仕上げる', async () => {
        // 「Rendering > Image rendering... を選ぶと、独立したレンダリングウィンドウが開き、
        //   静止画 (Still) モードになります」
        rw = await openRenderWindow(harness.app, 'Image rendering...');
        await expect(rw.locator('.render-panel .bottom-tab', { hasText: 'Still' })).toHaveClass(/active/);
        // 「1. Target にレンダリングしたいビューを選びます。Backend は既定の Umbreon」
        const bar = rw.locator('.render-panel-bar');
        await expect(bar.locator('select').last()).not.toHaveValue('');
        await expect(bar.locator('select').first().locator('option:checked')).toHaveText(/Umbreon/);
        // 「2. Image タブで出力サイズを選びます。プリセット (例: 1200×1200 (600dpi))」
        await showSettingsTab(rw, 'Image');
        const preset = settingSelect(rw, 'Preset');
        await preset.selectOption({ label: '1200×1200 (600dpi)' });
        await docShot(rw, `${SHOT}/3-image-tab`, {
            rect: await aroundBox(rw, [rw.locator('.render-window-settings-header'), preset], 80),
            highlight: preset,
        });
        // 「3. Render タブの Quality セクションで、Lighting が既定の Global Illumination
        //   になっていることを確かめます」
        await showSettingsTab(rw, 'Render');
        await expect(rw.getByText('Quality', { exact: true }).first()).toBeVisible();
        const lighting = settingSelect(rw, 'Lighting');
        await expect(lighting.locator('option:checked')).toHaveText('Global Illumination');
        // The tip's alternative is offered.
        await expect(lighting.locator('option', { hasText: 'Raytrace only' })).toHaveCount(1);
        // 「Supersampling は既定のままで構いません」
        await expect(rw.getByText('Supersampling', { exact: true }).first()).toBeVisible();
        await docShot(rw, `${SHOT}/3-render-tab`, {
            rect: await aroundBox(rw, [rw.locator('.render-window-settings-header'),
                rw.getByText('Supersampling', { exact: true }).first()], 80),
            highlight: lighting,
        });
        // 「4. Start Render を押すとレンダリングが始まり」
        await expect(startRenderButton(rw)).toBeEnabled();
        if (!process.env.E2E_SLOW) {
            test.info().annotations.push({
                type: 'skipped-step',
                description: '§3 Start Render と §4 の結果の確認 (E2E_SLOW=1 で有効)',
            });
            return;
        }
        await startRender(rw);
    });

    test('4. 結果を確認して保存する', async () => {
        test.skip(!process.env.E2E_SLOW, 'needs the raytrace of §3 (E2E_SLOW=1)');
        // 「結果画像がウィンドウ左上の画像領域に表示されます」
        await expect(rw.getByAltText('Render result')).toBeVisible();
        await docShot(rw, `${SHOT}/4-result`);
        await thumbShot(rw, 'publication-images', rw.getByAltText('Render result'));
        // 「Save で PNG ファイルとして保存します」
        const out = artifacts('publication-images', 'render.png');
        fs.rmSync(out, { force: true });
        await expectSaveDialog(harness.app, out);
        await rw.getByRole('button', { name: 'Save image', exact: true }).click();
        await waitForFile(out);
        const info = pngInfo(out);
        expect([info.width, info.height]).toEqual([1200, 1200]);
        // 「Copy」「矢印ボタンで過去のレンダリング結果の履歴」「Use settings」
        for (const name of ['Copy image to clipboard', 'Previous render', 'Next render']) {
            await expect(rw.getByRole('button', { name, exact: true })).toBeVisible();
        }
        await expect(rw.getByRole('button', { name: "Use this render's settings" })).toBeVisible();
        await rw.close();
    });
});
