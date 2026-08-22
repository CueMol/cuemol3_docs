/**
 * Doc: docs/ja/tutorials/basic/loading.md (基本操作コース 1 ページ目)
 *
 * The tests below mirror the page's numbered h2 sections. §4
 * (Scene・Object・Renderer・View) is a conceptual summary with no GUI
 * operation, so it has no test.
 *
 * Not automated (recorded as skipped-step annotations): §2's atom click and
 * the molecular view's right-click menu (Center at this atom). The context
 * menu is a native Electron menu on macOS, and which atom a click lands on
 * depends on the viewpoint, so neither can be driven deterministically.
 * Selecting a named residue is covered by selection.md's Molecular structure
 * panel instead.
 */
import { test, expect } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME, SECOND_OBJ } from '../../fixtures/course';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import { expectRow, sceneRow } from '../../helpers/sceneTree';
import { enterViewValue, setViewValue, viewPaneRowParts } from '../../helpers/viewPane';
import { clickAtomNearCenter, rotateView, zoomView } from '../../helpers/molView';
import { docShot } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/loading';

let harness: CueMolHarness;

test.describe.serial('構造の読み込みと表示', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
    });

    test.afterAll(async () => {
        await assertDialogQueuesEmpty(harness.app);
        await harness.close();
    });

    test.afterEach(async ({}, testInfo) => {
        testInfo.annotations.push({ type: 'doc', description: 'docs/ja/tutorials/basic/loading.md' });
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

    test('1. 構造を読み込む', async () => {
        const mark = harness.logs.mark();
        await setupLoadingPage.loadLysozyme(harness, {
            onGetPdbDialog: (dlg) => docShot(harness.window, `${SHOT}/1-getpdb`, { clip: dlg }),
            onOptionsDialog: async (dlg) => {
                // 「ファイル名 (1qio.cif) と、判別したファイル形式 (mmCIF) が表示されます」
                await expect(dlg.locator('.fod-file-name')).toHaveText('1qio.cif');
                await expect(dlg.locator('.fod-file-format')).toHaveText('mmCIF');
                // 「Renderer name は選んだ種類から自動で決まります (simple1)」
                await expect(dlg.locator('#rend-name')).toHaveValue('simple1');
                // 「Renderer type のリストの先頭には Presets というグループがあります」
                await expect(dlg.locator('#rend-type optgroup[label="Presets"]')).toHaveCount(1);
                // 「<形式>-specific options ... 既定のままなら (defaults) と表示されます」
                await expect(dlg.locator('.fod-collapsible-label')).toHaveText('mmCIF-specific options');
                await expect(dlg.locator('.fod-collapsible-hint')).toHaveText('(defaults)');
                await docShot(harness.window, `${SHOT}/1-open-options`, { clip: dlg });
            },
        });

        // 「分子が線画 (stick モデル) で表示されます。」
        await expectRow(harness.window, LYSOZYME);
        await expectRow(harness.window, 'simple1');
        // The reader-supplied object name must survive; the docs say CueMol
        // identifies the object by it from here on.
        // The reader (mmCIF for Get PDB) reports what it parsed, before any
        // renderer runs.
        const line = await harness.logs.waitForLine(' atoms', { from: mark });
        expect(line).toMatch(/read \d+ atoms/);
        await docShot(harness.window, `${SHOT}/1-loaded`);
    });

    test('2. 視点を操作する', async () => {
        // 「原子の上でクリックすると、その原子の名前がラベルとして分子ビューに
        //   表示されます。同時に、ステータスバーと Output パネルに ... が出ます」
        // Done before the gestures below, while the molecule is still centred
        // from loading: the synthetic wheel is auto-detected as a Mac trackpad
        // and pans the view instead of zooming, moving the molecule off centre.
        const hit = await clickAtomNearCenter(harness.window, LYSOZYME);
        // "Molecule [lysozyme], A TRP 63 CH2, O: 1.00 B: 12.58 Pos: (...)"
        await expect(harness.window.locator('.status-left'))
            .toContainText(/O: [\d.]+ B: [\d.]+ Pos: \(/);
        await expect(harness.window.locator('.bottom-panel-content pre[data-select-scope]'))
            .toContainText(`Molecule [${LYSOZYME}]`);
        await docShot(harness.window, `${SHOT}/2-atom-label`, {
            rect: { x: hit.x - 200, y: hit.y - 130, width: 400, height: 260 },
        });
        // The bar alone does not read as a status bar; include the bottom edge
        // of the window above it (where the same line is logged).
        const bar = (await harness.window.locator('.status-bar').boundingBox())!;
        await docShot(harness.window, `${SHOT}/2-status-bar`, {
            rect: { x: 0, y: bar.y - 60, width: 760, height: bar.height + 60 },
        });

        // 「1. 分子ビュー上を左ドラッグします」「2. ホイールを回します」
        await rotateView(harness.window);
        await zoomView(harness.window);
        await expect(harness.window.locator('canvas').first()).toBeVisible();

        // 「Rotation は相対値で、操作するとその角度だけ回り、値は 0 に戻ります」
        expect(await enterViewValue(harness.window, 'RotY', 90)).toMatch(/^0\s*deg/);

        // 「3. Explorer > View パネルで Zoom の値をクリックし、40 と入力して Enter」
        // (Zoom は絶対値なので入力した値がそのまま残る)
        await setViewValue(harness.window, 'Zoom', 40);
        await docShot(harness.window, `${SHOT}/2-view-zoom`, {
            clip: viewPaneRowParts(harness.window, 'Zoom'),
            pad: 0,
        });
        // The pane as a whole, for the paragraph about how its rows work.
        await docShot(harness.window, `${SHOT}/2-view-pane`, {
            clip: harness.window.locator('.view-pane'),
        });

        test.info().annotations.push({
            type: 'skipped-step',
            description: '§2 分子ビューの右クリックメニュー (macOS ではネイティブメニューのため撮影・操作ともできない)',
        });
    });

    test('3. もう 1 つ分子を読み込む', async () => {
        await setupLoadingPage.loadSecondObject(harness, {
            onOptionsDialog: (dlg) => docShot(harness.window, `${SHOT}/3-open-options`, { clip: dlg }),
        });

        // 「Object name は既定のまま (1g59) にして」— Get PDB lower-cases the id.
        await expectRow(harness.window, SECOND_OBJ);
        await expectRow(harness.window, 'trace1');

        // 「1. Zoom に 300 と入力します」「2. Slab に 300 と入力します」
        // Widening Zoom alone is not enough: the default 50 A slab clips
        // lysozyme, which sits about 100 A away from 1g59.
        await setViewValue(harness.window, 'Zoom', 300);
        await setViewValue(harness.window, 'Slab', 300);
        await docShot(harness.window, `${SHOT}/3-two-objects`);
    });

    test('5. シーンツリーで全体を把握する', async () => {
        // 「いまは lysozyme と 1g59 の 2 つの Object があり、それぞれに
        //   simple / trace の Renderer が付いています」
        for (const name of [LYSOZYME, 'simple1', SECOND_OBJ, 'trace1']) {
            await expect(sceneRow(harness.window, name)).toBeVisible();
        }
        // 「名前のない Renderer は括弧と型だけが表示されます」
        await expect(harness.window.getByText('(*selection)').first()).toBeVisible();
        // 「いちばん下の Camera と Styles は…」
        await expect(harness.window.getByText('Camera', { exact: true })).toBeVisible();
        await expect(harness.window.getByText('Styles', { exact: true })).toBeVisible();
        // 「パネル上部には 4 つのボタンがあります」(Add / Focus / Delete / Property)
        await expect(harness.window.locator('.section-action-btn')).toHaveCount(4);

        // Header (it carries the Delete button the section mentions) down to
        // the last renderer row; Camera / Styles are not part of this section.
        await docShot(harness.window, `${SHOT}/5-scene-tree`, {
            clip: [
                harness.window.locator('.sp-pane').first().locator('.sp-section-header'),
                harness.window.getByText('(*selection)').last(),
            ],
        });
    });
});
