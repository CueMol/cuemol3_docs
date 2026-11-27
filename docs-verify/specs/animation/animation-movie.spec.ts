/**
 * Doc: docs/ja/tutorials/animation/animation-movie.md (アニメーションの作成と動画の出力)
 *
 * The tests mirror the page's numbered h2 sections. The first half starts
 * from the ribbon-figure scene; §1 builds a short version of it (3UG9
 * cartoon plus the retinal ballstick); its spin / camera motion / show
 * strips last 5 + 3 + 2 s. §7 works in a new scene, and §8 renders the
 * first scene (10 s) as a movie with E2E_SLOW=1.
 */
import * as fs from 'node:fs';
import { test, expect, type Locator } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { artifacts } from '../../support/env';
import {
    assertDialogQueuesEmpty, clickDialogButton, dialog, expectDialogClosed, expectSaveDialog,
} from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { checkField, fieldControl } from '../../helpers/form';
import { clickMenu } from '../../helpers/menu';
import {
    clickSceneToolbar, expectRow, rowContextMenu, rowVisibilityToggle, selectRow, toggleRowVisibility,
} from '../../helpers/sceneTree';
import {
    addAnimElement, addElementButton, animInspectorRow, animPanel, animRow, currentTimeField, currentTimeText,
    durationField, reselectAnimElement, selectAnimElement, setAnimDuration, showAnimPanel, startCameraSelect, transportBar,
    transportButton, typeCurrentTime,
} from '../../helpers/animPanel';
import { setNumericProperty } from '../../helpers/inspector';
import { setViewValue, viewValueText } from '../../helpers/viewPane';
import { openSidebarView } from '../../helpers/sidebar';
import { showBottomTab } from '../../helpers/bottomPanel';
import { clearConsole, runConsole } from '../../helpers/console';
import { openRenderWindow, settingSelect, showSettingsTab, startRenderButton } from '../../helpers/renderWindow';
import { aroundBox, docShot, sidebarRect, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/animation/animation-movie';
const DOC = 'docs/ja/tutorials/animation/animation-movie.md';
const OBJ = '3ug9';

let harness: CueMolHarness;
let spin = '';

/**
 * The timeline length as the scene keeps it (`list_anims`). The panel's own
 * length readout can lag behind an inspector edit, so it is not used here.
 */
async function expectAnimLength(ms: number): Promise<void> {
    const w = harness.window;
    const out = (await runConsole(w, 'list_anims')).join('\n');
    await clearConsole(w);
    await showBottomTab(w, 'Animation');
    expect(out).toContain(`length ${ms} ms`);
}

/** The whole bottom panel (tabs and the Animation panel). */
async function bottomPanelShot(id: string, highlight?: Locator | Locator[]): Promise<void> {
    const w = harness.window;
    await docShot(w, id, {
        clip: [w.locator('.bottom-panel-tabs').first(), animPanel(w)],
        pad: 0,
        highlight,
    });
}

/**
 * The inspector from its header down to just below `target`, which is
 * framed. (The animation element inspector has no mode bar for
 * inspectorRect to measure from.)
 */
async function inspectorShot(id: string, target: Locator, below = 40): Promise<void> {
    const w = harness.window;
    if (!process.env.DOCSHOT) return;
    const t = await target.boundingBox();
    const head = await w.locator('.inspector-header').filter({ visible: true }).first().boundingBox();
    if (!t || !head) throw new Error('[animation-movie] inspector not visible');
    const vp = w.viewportSize() ?? { width: 1280, height: 800 };
    const x = Math.max(0, head.x - 8);
    const y = Math.max(0, head.y);
    const y2 = Math.min(vp.height, t.y + t.height + below);
    await docShot(w, id, { rect: { x, y, width: vp.width - x, height: y2 - y }, highlight: target });
}

async function selectMol(section: Locator, name: string): Promise<void> {
    const sel = section.getByRole('combobox', { name: 'Molecule' }).first();
    const v = await sel.locator('option').filter({ hasText: name }).first().getAttribute('value');
    if (v === null) throw new Error(`no molecule ${name}`);
    await sel.selectOption(v);
}

/** The camera pane's "New camera from view" with the default name; returns the name. */
async function newCameraFromView(): Promise<string> {
    const w = harness.window;
    await openSidebarView(w, 'explorer');
    await w.locator('.sp-pane.camera-pane .section-action-btn').first().click();
    const dlg = dialog(w, 'New Camera');
    await expect(dlg).toBeVisible();
    const name = await dlg.locator('input').first().inputValue();
    await clickDialogButton(w, 'New Camera', 'Create');
    await expectDialogClosed(w, 'New Camera');
    await expect(w.locator('.sp-pane.camera-pane').getByText(name, { exact: true })).toBeVisible();
    return name;
}

test.describe.serial('アニメーションの作成と動画の出力', { tag: '@net' }, () => {
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

    test('1. アニメーションのしくみ', async () => {
        const w = harness.window;
        // The ribbon-figure scene, shortened: cartoon plus the retinal ballstick.
        await getPdb(harness.app, w, { id: '3UG9', rendType: 'cartoon' });
        await expectRow(w, OBJ);
        await openSidebarView(w, 'explorer');
        await rowContextMenu(harness.app, w, OBJ, ['New Renderer…']);
        const dlg = dialog(w, 'New Renderer');
        await expect(dlg).toBeVisible();
        await fieldControl(dlg, 'Renderer type').selectOption('ballstick');
        await checkField(dlg, 'Selection');
        await dlg.getByPlaceholder('* (all atoms)').fill('r; RET');
        await clickDialogButton(w, 'New Renderer', 'Create');
        await expectDialogClosed(w, 'New Renderer');
        await expectRow(w, 'ballstick1');
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await clickMenu(harness.app, ['Scene', 'Background', 'White']);
    });

    test('2. Animation パネルを開く', async () => {
        // 「下部パネルの Animation タブを開きます」
        const w = harness.window;
        await showAnimPanel(w);
        await bottomPanelShot(`${SHOT}/2-anim-panel`, w.locator('.bottom-panel-tabs .bottom-tab', { hasText: /^Animation$/ }).first());
    });

    test('3. 分子を回転させる', async () => {
        const w = harness.window;
        // 「1. パネルの追加メニューから Simple spin を選びます」
        spin = await addAnimElement(w, 'Simple spin', async (menu, item) => {
            await docShot(w, `${SHOT}/3-add-menu`, {
                rect: await aroundBox(w, [menu, addElementButton(w)], 40),
                highlight: item,
            });
        });
        // 「2. ストリップが追加されるので、選択して右側のインスペクタを確認します」
        await selectAnimElement(w, spin);
        await expect(w.getByText('SimpleSpin', { exact: true }).last()).toBeVisible();
        // 「3. Rotation angle (回転角) と Spin axis (回転軸) を調整します。360° にすると 1 周」
        await setNumericProperty(w, 'SimpleSpin', 'Rotation angle', 360);
        const axis = animInspectorRow(w, 'Spin axis').locator('select').first();
        await axis.selectOption('y');
        await expect(axis).toHaveValue('y');
        // 「4. Common セクションの Duration で、回転にかける時間を 5 秒にします」
        await setAnimDuration(w, '5s');
        await expect(durationField(w)).toContainText('5');
        await expectAnimLength(5000);
        await reselectAnimElement(w, spin);
        await expect(durationField(w)).toContainText('05');
        await inspectorShot(`${SHOT}/3-spin-inspector`, animInspectorRow(w, 'Spin axis'));
        await docShot(w, `${SHOT}/3-simple-spin`);
    });

    test('4. 再生して確認する', async () => {
        const w = harness.window;
        // 「パネルの再生ボタンを押すと、アニメーションが分子ビュー上で実際に再生されます」
        await bottomPanelShot(`${SHOT}/4-transport`, [transportButton(w, 'Play'), currentTimeField(w)]);
        const t0 = await currentTimeText(w);
        await transportButton(w, 'Play').click();
        await expect.poll(() => currentTimeText(w), { timeout: 10_000 }).not.toBe(t0);
        await transportButton(w, 'Stop').click();
        // 「現在時刻の欄に時刻を打ち込んで Enter を押して、任意の時点の状態を確かめる」
        await typeCurrentTime(w, '0:00.500');
        await expect.poll(() => currentTimeText(w)).toBe('0:00.500');
    });

    test('5. カメラモーションを加える', async () => {
        const w = harness.window;
        // 「2. 始点にしたい視点に合わせ ... New camera from view を押して保存します」
        await transportButton(w, 'Skip to start').click();
        await openSidebarView(w, 'explorer');
        // 「1. 背景が白のシーンでは ... View パネルの Slab を 200 Å 程度に広げておきます」
        await setViewValue(w, 'Slab', 200);
        expect(await viewValueText(w, 'Slab')).toMatch(/^200/);
        const newCam = w.locator('.sp-pane.camera-pane .section-action-btn').first();
        await docShot(w, `${SHOT}/5-new-camera`, { rect: await sidebarRect(w, newCam, 120), highlight: newCam });
        const start = await newCameraFromView();
        // 「3. 同様に、終点にしたい視点に合わせて、もう 1 つカメラを保存します」
        await setViewValue(w, 'Zoom', 25);
        const end = await newCameraFromView();
        await setViewValue(w, 'Zoom', 60);
        // 「4. タイムラインのヘッダで、開始カメラに始点のカメラを指定します」
        await showBottomTab(w, 'Animation');
        await startCameraSelect(w).selectOption({ label: start });
        await expect(startCameraSelect(w)).toHaveValue(start);
        await bottomPanelShot(`${SHOT}/5-start-cam`, startCameraSelect(w));
        // 「5. 追加メニューから Camera motion を選びます」
        const cam = await addAnimElement(w, 'Camera motion');
        // 「6. ストリップを選び、インスペクタの Target camera に終点のカメラ」
        await selectAnimElement(w, cam);
        const target = animInspectorRow(w, 'Target camera').locator('select').first();
        await target.selectOption(end);
        await expect(target).toHaveValue(end);
        // 「7. Duration を 3 秒にします」
        await setAnimDuration(w, '3s');
        await expectAnimLength(8000);
        await reselectAnimElement(w, cam);
        await inspectorShot(`${SHOT}/5-cam-inspector`, animInspectorRow(w, 'Target camera'));
    });

    test('6. 表示の切り替えを加える', async () => {
        const w = harness.window;
        // 「1. 追加メニューから Show (フェードイン) を選びます」
        const show = await addAnimElement(w, 'Show');
        // 「2. インスペクタで、対象の Renderer をチェックリストから選びます」
        await selectAnimElement(w, show);
        const box = animInspectorRow(w, 'Target renderers')
            .locator('label', { hasText: `${OBJ}/ballstick1` }).locator('input[type="checkbox"]');
        // The list is controlled by the element's committed value, so the
        // tick shows only after the round trip.
        await box.click();
        await expect(box).toBeChecked();
        // 「3. Duration を 2 秒にします」
        await setAnimDuration(w, '2s');
        await expectAnimLength(10000);
        await reselectAnimElement(w, show);
        await inspectorShot(`${SHOT}/6-show-inspector`, animInspectorRow(w, 'Target renderers'));
        await selectAnimElement(w, spin);
        // Back to the start so the view shows the start camera.
        await transportButton(w, 'Skip to start').click();
        await w.waitForTimeout(800);
        await docShot(w, `${SHOT}/6-timeline`);
        await thumbShot(w, 'animation-movie');
    });

    test('7. モーフィングを加える', async () => {
        const w = harness.window;
        await test.step('2 つの構造を読み込む', async () => {
            // 「1. File > New Tab を選び、New Scene で新しいシーンを作ります」
            await clickMenu(harness.app, ['File', 'New Tab']);
            const nt = dialog(w, 'New Tab/Window');
            await expect(nt).toBeVisible();
            await nt.getByRole('button', { name: 'OK', exact: true }).click();
            await expectDialogClosed(w, 'New Tab/Window');
            // 「2. 1TND ... cartoon を選び、Selection に c; A」
            await getPdb(harness.app, w, {
                id: '1TND',
                rendType: 'cartoon',
                onOptionsDialog: async (dlg) => {
                    await checkField(dlg, 'Selection');
                    await dlg.getByPlaceholder('* (all atoms)').fill('c; A');
                },
            });
            // 「3. 同様に 1TAG も取得します (Renderer は cartoon)」
            await getPdb(harness.app, w, { id: '1TAG', rendType: 'cartoon' });
            await expectRow(w, '1tnd');
            await expectRow(w, '1tag');
        });

        await test.step('1TAG を 1TND に重ね合わせる', async () => {
            // 「1. Tools > Molecular superposition... を開きます」
            await showBottomTab(w, 'Output');
            await clickMenu(harness.app, ['Tools', 'Molecular superposition...']);
            const dlg = dialog(w, 'Molecular superposition');
            await expect(dlg).toBeVisible();
            // 「2. Algorithm の Method で SSM を選びます」
            await dlg.getByText('SSM', { exact: true }).click();
            const sections = dlg.locator('.h3-form-field-section');
            // 「3. Reference の Molecule で 1TND を選び、Selection に c; A」
            const ref = sections.filter({ hasText: /^Reference/ }).first();
            await selectMol(ref, '1tnd');
            await ref.getByPlaceholder('* (all atoms)').fill('c; A');
            // 「4. Moving の Molecule で 1TAG を選びます」
            await selectMol(sections.filter({ hasText: /^Moving/ }).first(), '1tag');
            await docShot(w, `${SHOT}/7-superpose`, { clip: dlg });
            // 「5. OK を押すと、1TAG が 1TND の chain A に重なる位置へ移動します」
            await clickDialogButton(w, 'Molecular superposition', 'OK');
            await expectDialogClosed(w, 'Molecular superposition', 60_000);
            // 「重ね合わせの結果 (RMSD や対応づけられた残基数) は ... Output のログ」
            const output = w.locator('.bottom-panel-content pre[data-select-scope]').first();
            await expect(output).toContainText('RMSD', { timeout: 60_000 });
        });

        await test.step('MorphMol に変換してフレームを追加する', async () => {
            // 「1. Tools > Mol morphing animation... を開きます」
            await clickMenu(harness.app, ['Tools', 'Mol morphing animation...']);
            const dlg = dialog(w, 'Morph animation tool');
            await expect(dlg).toBeVisible();
            // 「2. Target で、変化の始点にする 1TND を選びます」
            await fieldControl(dlg, 'Target').selectOption({ label: '1tnd' });
            const convert = dlg.getByRole('button', { name: 'Convert to MorphMol', exact: true });
            await docShot(w, `${SHOT}/7-morph-convert`, { clip: dlg, highlight: convert });
            // 「3. Convert to MorphMol を押します」
            await dlg.getByRole('button', { name: 'Convert to MorphMol', exact: true }).click();
            // 「4. Add mol... を押し、変化の終点となる 1TAG を選びます」
            await dlg.getByRole('button', { name: 'Add mol...', exact: true }).click();
            await fieldControl(dlg, 'Molecule to add').selectOption({ label: '1tag' });
            await dlg.getByRole('button', { name: 'Add as frame', exact: true }).click();
            // 「5. フレームの一覧に、元の構造 ((this)) と追加した構造が並んだことを確認して」
            await expect(dlg).toContainText('(this)');
            await expect(dlg.getByText('1tag', { exact: true }).last()).toBeVisible();
            await docShot(w, `${SHOT}/7-morph-dialog`, { clip: dlg });
            await dlg.getByRole('button', { name: 'Close', exact: true }).click();
            await expectDialogClosed(w, 'Morph animation tool');
            // 「1TAG の Object は ... 非表示にして構いません」
            await openSidebarView(w, 'explorer');
            await toggleRowVisibility(w, '1tag');
            await expect(rowVisibilityToggle(w, '1tag')).toHaveClass(/hidden/);
        });

        await test.step('タイムラインに載せて再生する', async () => {
            // 「1. Animation パネルの追加メニューから Mol morphing を選びます」
            await showAnimPanel(w);
            const morph = await addAnimElement(w, 'Mol morphing');
            // 「2. ストリップを選び、インスペクタの Target MorphMol で変換した 1TND」
            await selectAnimElement(w, morph);
            const target = animInspectorRow(w, 'Target MorphMol').locator('select').first();
            await target.selectOption('1tnd');
            await expect(target).toHaveValue('1tnd');
            // 「3. 再生すると、GTP 結合型と GDP 結合型の間で分子が変形します」
            await transportButton(w, 'Skip to start').click();
            const t0 = await currentTimeText(w);
            await transportButton(w, 'Play').click();
            await expect.poll(() => currentTimeText(w), { timeout: 10_000 }).not.toBe(t0);
            await transportButton(w, 'Stop').click();
            await expect(animRow(w, morph)).toBeVisible();
            await docShot(w, `${SHOT}/7-morph-timeline`);
        });
    });

    test('8. 動画に出力する', async () => {
        // 「Rendering > Movie rendering... を選ぶと、レンダリングウィンドウが動画 (Movie) モードで開きます」
        const rw = await openRenderWindow(harness.app, 'Movie rendering...');
        await expect(rw.locator('.render-panel .bottom-tab', { hasText: 'Movie' })).toHaveClass(/active/);
        // 「1. Target で、3UG9 のシーンのビューを選びます。Backend は既定の Umbreon」
        const bar = rw.locator('.render-panel-bar');
        await expect(bar.locator('select').first().locator('option:checked')).toHaveText(/Umbreon/);
        const targetView = bar.locator('select').last();
        // The views are listed in the order the scenes were created: the
        // first is the 3UG9 scene, the front one is the morphing scene.
        await expect(targetView.locator('option')).toHaveCount(2);
        const scene1View = (await targetView.locator('option').first().innerText()).trim();
        await targetView.selectOption({ index: 0 });
        await expect(targetView.locator('option:checked')).toHaveText(scene1View);
        await docShot(rw, `${SHOT}/8-movie-target`, { rect: await aroundBox(rw, bar, 30), highlight: targetView });
        // 「2. Image タブでサイズ (例: VGA (640×480)) を選びます」
        await showSettingsTab(rw, 'Image');
        const preset = settingSelect(rw, 'Preset');
        await preset.selectOption({ label: 'VGA (640×480)' });
        // 「Frame rate は通常 24〜30 で十分です」
        await expect(rw.getByText('Frame rate', { exact: true }).first()).toBeVisible();
        await docShot(rw, `${SHOT}/8-movie-settings`, {
            rect: await aroundBox(rw, [rw.locator('.render-window-settings-header'),
                rw.getByText('Frame rate', { exact: true }).first()], 80),
            highlight: preset,
        });
        await expect(startRenderButton(rw)).toBeEnabled();
        if (!process.env.E2E_SLOW) {
            test.info().annotations.push({
                type: 'skipped-step',
                description: '§8 Start Render による動画の書き出し (E2E_SLOW=1 で有効)',
            });
            await rw.close();
            return;
        }
        // 「3. Start Render を押すと ... ffmpeg で動画ファイルにエンコードされます」
        // 300 frames, each a Global Illumination render: several minutes.
        test.setTimeout(1_800_000);
        await startRenderButton(rw).click();
        const saveAs = rw.getByRole('button', { name: 'Save movie as', exact: true });
        await expect(saveAs).toBeVisible({ timeout: 1_700_000 });
        await docShot(rw, `${SHOT}/8-movie-done`);
        // 「4. Save movie as... で完成した動画を好きな場所に保存します」
        const out = artifacts('animation-movie', '3ug9-animation.mp4');
        fs.rmSync(out, { force: true });
        await expectSaveDialog(harness.app, out);
        await saveAs.click();
        await expect.poll(() => fs.existsSync(out) && fs.statSync(out).size > 0, { timeout: 30_000 }).toBe(true);
        await rw.close();
    });
});
