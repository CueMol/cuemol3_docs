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
import { setViewValue, viewPaneRowParts } from '../../helpers/viewPane';
import { rotateView, zoomView } from '../../helpers/molView';
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
            onOptionsDialog: (dlg) => docShot(harness.window, `${SHOT}/1-open-options`, { clip: dlg }),
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
        // 「1. 分子ビュー上を左ドラッグします」「2. ホイールを回します」
        await rotateView(harness.window);
        await zoomView(harness.window);
        await expect(harness.window.locator('canvas').first()).toBeVisible();

        // 「3. Explorer > View パネルで Zoom の値をクリックし、40 と入力して Enter」
        await setViewValue(harness.window, 'Zoom', 40);
        await docShot(harness.window, `${SHOT}/2-view-zoom`, {
            clip: viewPaneRowParts(harness.window, 'Zoom'),
            pad: 0,
        });
        await docShot(harness.window, `${SHOT}/2-zoomed`);

        test.info().annotations.push({
            type: 'skipped-step',
            description: '§2 原子クリックによるラベル表示と Center at this atom (macOS ではネイティブメニュー)',
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
        // 「分子を読み込むと、選択部分をハイライト表示するための *selection という
        //   Renderer も自動で作られます」
        await expect(harness.window.getByText('(*selection)').first()).toBeVisible();

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
