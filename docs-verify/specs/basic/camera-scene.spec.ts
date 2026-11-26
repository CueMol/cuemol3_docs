/**
 * Doc: docs/ja/tutorials/basic/camera-scene.md (基本操作コース 5 ページ目)
 *
 * Starts from a scene built by the earlier pages of the course (loading.md
 * and renderers.md; the colours of coloring.md play no part here) and
 * mirrors the page's numbered h2 sections.
 *
 * The page's existing figure of the Camera panel (camera-created.webp) was
 * made by hand and is left as it is; this spec does not shoot it.
 *
 * Not automated: closing a tab with unsaved changes (§4 タブを閉じる) asks
 * whether to save, which the spec does not answer.
 */
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME } from '../../fixtures/course';
import { setupRenderersPage } from '../../fixtures/courseRenderers';
import {
    assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed, expectOpenDialog, expectSaveDialog,
} from '../../helpers/dialogs';
import { clickMenu } from '../../helpers/menu';
import { getPdb } from '../../helpers/openFile';
import { expectRow } from '../../helpers/sceneTree';
import { setViewValue, viewValueText } from '../../helpers/viewPane';
import { openSidebarView } from '../../helpers/sidebar';
import { docShot, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/camera-scene';
const DOC = 'docs/ja/tutorials/basic/camera-scene.md';
const QSC = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'docs-verify-')), 'tutorial1.qsc');

let harness: CueMolHarness;

async function waitForFile(p: string, timeoutMs = 15_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (fs.existsSync(p) && fs.statSync(p).size > 0) return;
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`[docs-verify] file did not appear: ${p}`);
}

function cameraPane(w: Page) {
    return w.locator('.sp-pane.camera-pane').first();
}

function tabs(w: Page) {
    return w.locator('.tab-bar .tab-title');
}

test.describe.serial('カメラとシーンの保存', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
        await setupLoadingPage.run(harness);
        await setupRenderersPage.run(harness);
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

    test('1. カメラで視点を保存する', async () => {
        const w = harness.window;
        // 「1. 視点を保存したい状態に合わせます」(Explorer > View パネルの Zoom で)
        await openSidebarView(w, 'explorer');
        await setViewValue(w, 'Zoom', 40);
        const saved = await viewValueText(w, 'Zoom');
        // 「2. アクティビティバーの Explorer をクリックし、Camera パネルを開きます」
        await openSidebarView(w, 'explorer');
        const pane = cameraPane(w);
        await expect(pane).toBeVisible();
        // 「3. パネル上部の New camera from view ボタンを押します」
        await pane.locator('.section-action-btn').first().click();
        // 「4. 名前を付けて作成します (既定の名前のままでも構いません)」
        const dlg = dialog(w, 'New Camera');
        await expect(dlg).toBeVisible();
        await expect(dlg.locator('input').first()).toHaveValue('camera_0');
        await docShot(w, `${SHOT}/1-new-camera`, { clip: dlg });
        await clickDialogButton(w, 'New Camera', 'Create');
        await expectDialogClosed(w, 'New Camera');
        // 「作成したカメラは一覧に並びます」
        const row = pane.getByText('camera_0', { exact: true });
        await expect(row).toBeVisible();
        // 「視点を適当に動かしてから、カメラ行をダブルクリックしてみてください。保存した視点に戻ります」
        await setViewValue(w, 'Zoom', 120);
        expect(await viewValueText(w, 'Zoom')).not.toBe(saved);
        await row.dblclick();
        await expect.poll(() => viewValueText(w, 'Zoom')).toBe(saved);
    });

    test('2. シーンを保存する', async () => {
        const w = harness.window;
        // 「File > Save Scene で .qsc ファイルに保存します。tutorial1.qsc という名前で」
        await expectSaveDialog(harness.app, QSC);
        await clickMenu(harness.app, ['File', 'Save Scene']);
        const opts = dialog(w, 'Scene options');
        await expect(opts).toBeVisible();
        await clickDialogButton(w, 'Scene options', 'OK');
        await expectDialogClosed(w, 'Scene options');
        await waitForFile(QSC);
        // 「保存時には、そのときの視点が __current という名前のカメラとして自動で記録されます」
        expect(fs.readFileSync(QSC, 'latin1')).toContain('__current');
    });

    test('3. シーンを読み込む', async () => {
        // 「いったん CueMol3 を終了して起動し直し、File > Open Scene... で tutorial1.qsc を開いて」
        await harness.restart();
        const w = harness.window;
        await expectOpenDialog(harness.app, QSC);
        await clickMenu(harness.app, ['File', 'Open Scene...']);
        // 「保存した状態がそのまま復元されます」
        await expectRow(w, LYSOZYME, 60_000);
        await expectRow(w, 'ballstick1');
        await expectRow(w, 'ribbon1');
        await openSidebarView(w, 'explorer');
        await expect(cameraPane(w).getByText('camera_0', { exact: true })).toBeVisible();
        await docShot(w, `${SHOT}/3-reopened`);
        await thumbShot(w, 'camera-scene');
    });

    test('4. 複数のシーンをタブで扱う', async () => {
        const w = harness.window;
        const before = await tabs(w).count();
        // 「1. File > New Tab を選び、New Scene で新しいシーンを作ります」
        await clickMenu(harness.app, ['File', 'New Tab']);
        const dlg = dialog(w, 'New Tab/Window');
        await expect(dlg).toBeVisible();
        await expect(dlg.getByRole('radio', { name: 'New Scene' })).toBeChecked();
        await docShot(w, `${SHOT}/4-new-tab`, { clip: dlg });
        await clickDialogButton(w, 'New Tab/Window', 'OK');
        await expectDialogClosed(w, 'New Tab/Window');
        await expect(tabs(w)).toHaveCount(before + 1);
        // 「3. File > Get PDB... で 1EHZ を取得し、Renderer type に nucl を選びます」
        await getPdb(harness.app, w, { id: '1EHZ', rendType: 'nucl' });
        await expectRow(w, '1ehz');
        await expectRow(w, 'nucl1');
        await docShot(w, `${SHOT}/4-tabs`);
        // 「4. タブをクリックすると、シーンを行き来できます。シーンツリーの内容も切り替わります」
        await tabs(w).first().click();
        await expectRow(w, LYSOZYME);
        test.info().annotations.push({
            type: 'skipped-step',
            description: '§4 タブを閉じる (未保存のシーンで出る確認には答えない)',
        });
    });

    test('5. 同じシーンをもう 1 つの視点で見る', async () => {
        const w = harness.window;
        const before = await tabs(w).count();
        // 「File > New Tab で New View を選ぶと ... 現在のシーンを映すもう 1 つのビュー」
        await clickMenu(harness.app, ['File', 'New Tab']);
        const dlg = dialog(w, 'New Tab/Window');
        await expect(dlg).toBeVisible();
        const newView = dlg.getByRole('radio', { name: /^New View for / });
        await newView.check({ force: true });
        await expect(newView).toBeChecked();
        // 「現在のビューの設定を引き継ぐかどうかも選べます」(Inherit view props)
        await expect(dlg.getByText('Inherit view props', { exact: true })).toBeVisible();
        await docShot(w, `${SHOT}/5-new-view`, { clip: dlg });
        await clickDialogButton(w, 'New Tab/Window', 'OK');
        await expectDialogClosed(w, 'New Tab/Window');
        await expect(tabs(w)).toHaveCount(before + 1);
        // The new view shows the same scene.
        await expectRow(w, LYSOZYME);
    });
});
