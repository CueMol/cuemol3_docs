/**
 * Doc: docs/ja/tutorials/experimental/symmetry.md (対称分子・単位格子の表示)
 *
 * The tests mirror the page's numbered h2 sections. §5 right-clicks an atom
 * of a symmetry mate: the molecular view's context menu is native on
 * macOS, so points near the view centre are tried with the context-menu
 * driver until the menu shows a symop row (helpers/popupMenu.ts). The menu
 * itself is captured from the screen (helpers/nativeShot.ts).
 */
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import { getPdb } from '../../helpers/openFile';
import { clickSceneToolbar, expectRow, rowVisibilityToggle, selectRow, toggleRowVisibility } from '../../helpers/sceneTree';
import { clearLastContextLabels, lastContextLabels, pickNextContextItem } from '../../helpers/popupMenu';
import { nativeMenuShot } from '../../helpers/nativeShot';
import { openSidebarView } from '../../helpers/sidebar';
import { setViewValue } from '../../helpers/viewPane';
import { docShot, sidebarRect, thumbShot } from '../../helpers/docShot';

const SHOT = 'tutorials/experimental/symmetry';
const DOC = 'docs/ja/tutorials/experimental/symmetry.md';
const OBJ = '1qio';

let harness: CueMolHarness;

function symmetryPane(w: Page) {
    return w.locator('.sp-pane').filter({ has: w.getByText('Symm mol', { exact: true }) }).first();
}

/** A point on a symmetry-mate atom: its context menu carries a "symop: ..." row. */
async function findSymmAtom(w: Page): Promise<{ x: number; y: number }> {
    const box = (await w.locator('canvas').evaluateAll((cs) => cs
        .map((c) => c.getBoundingClientRect())
        .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }))
        .sort((a, b) => b.width * b.height - a.width * a.height)[0]))!;
    for (let gy = 0.2; gy <= 0.8; gy += 0.1) {
        for (let gx = 0.1; gx <= 0.9; gx += 0.08) {
            const p = { x: Math.round(box.x + box.width * gx), y: Math.round(box.y + box.height * gy) };
            await clearLastContextLabels(harness.app);
            await w.waitForTimeout(600);
            await w.mouse.click(p.x, p.y, { button: 'right' });
            await w.waitForTimeout(250);
            if ((await lastContextLabels(harness.app)).some((l) => l.startsWith('symop:'))) return p;
        }
    }
    throw new Error('[docs-verify] no symmetry-mate atom found');
}

test.describe.serial('対称分子・単位格子の表示', { tag: '@net' }, () => {
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

    test('1. 結晶構造を読み込む', async () => {
        await getPdb(harness.app, harness.window, { id: '1QIO', rendType: 'cartoon' });
        await expectRow(harness.window, OBJ);
    });

    test('2. 結晶学的情報を確認する', async () => {
        const w = harness.window;
        // 「Crystal > Symmetry パネルを開きます」「1. Object で対象 (1QIO) を選びます」
        await openSidebarView(w, 'crystal');
        const pane = symmetryPane(w);
        await pane.locator('select').first().selectOption({ label: OBJ });
        // 「2. 格子定数と空間群が表示されます」
        await expect(pane).toContainText('Tetragonal');
        await expect(pane).toContainText('76.93');
        await expect(pane).toContainText('37.21');
        await docShot(w, `${SHOT}/2-symmetry`, {
            rect: await sidebarRect(w, pane.getByText('Symm mol', { exact: true }), 30),
            highlight: pane.locator('.sp-pane-fill').first(),
        });
    });

    test('3. 単位格子を表示する', async () => {
        const w = harness.window;
        const pane = symmetryPane(w);
        // 「パネルの Unit cell ボタンを押すと、単位格子の枠がシーンに追加されます」
        await pane.getByRole('button', { name: 'Unit cell', exact: true }).click();
        await openSidebarView(w, 'explorer');
        // 「シーンツリーには unitcell (*unitcell) の行として現れ」
        await expectRow(w, 'unitcell');
    });

    test('4. 対称分子を表示する', async () => {
        const w = harness.window;
        await selectRow(w, OBJ);
        await clickSceneToolbar(w, 'focus');
        await openSidebarView(w, 'crystal');
        const pane = symmetryPane(w);
        // 「Symm mol ボタンから表示範囲を選びます」「まず 50 Å で接している分子だけを確かめ」
        await pane.getByRole('button', { name: /Symm mol/ }).click();
        const menu = w.locator('.bp5-popover .bp5-menu').last();
        for (const l of ['20 Å', '50 Å', '100 Å', '200 Å', 'Unit cell']) {
            await expect(menu.getByText(l, { exact: true })).toBeVisible();
        }
        await docShot(w, `${SHOT}/4-symm-menu`, {
            rect: await sidebarRect(w, menu, 30),
            highlight: menu.getByText('50 Å', { exact: true }),
        });
        await menu.getByText('50 Å', { exact: true }).click();
        await openSidebarView(w, 'explorer');
        // 「対称分子はシーンツリーに symm (*symm) の行として追加され」
        await expectRow(w, 'symm');
        await w.waitForTimeout(1500);
        await docShot(w, `${SHOT}/4-symm-50`);
        // 「Unit cell — 単位格子 1 つ分の対称分子を表示します」
        await openSidebarView(w, 'crystal');
        await pane.getByRole('button', { name: /Symm mol/ }).click();
        await w.locator('.bp5-popover .bp5-menu').last().getByText('Unit cell', { exact: true }).click();
        // 「View パネルの Zoom を 120 Å 程度に広げると全体が見えます」
        await openSidebarView(w, 'explorer');
        await setViewValue(w, 'Zoom', 120);
        await w.waitForTimeout(1500);
        await docShot(w, `${SHOT}/4-symm-cell`);
        await thumbShot(w, 'symmetry');
    });

    test('5. 対称分子を独立した Object にする', async () => {
        const w = harness.window;
        // 「1. 分子ビューで、対称分子の原子を右クリックします」
        const p = await findSymmAtom(w);
        // 「2. メニューの先頭に対称操作 (symop: ...) が表示される」
        // 「2. 原子と Renderer の名前の下に、対称操作 (symop: ...) が表示される」
        const labels = await lastContextLabels(harness.app);
        expect(labels[0]).toMatch(new RegExp(`^${OBJ}: `));
        expect(labels[1]).toBe('symm (*symm)');
        expect(labels[2]).toMatch(/^symop: /);
        expect(labels).toContain('Center at SYMM atom');
        expect(labels).toContain('Create SYMM mol...');
        const symop = labels[2].replace(/^symop: /, '');
        // The real (native) menu, captured from the screen.
        await w.mouse.move(p.x, p.y);
        await nativeMenuShot(harness.app, w, `${SHOT}/5-context-menu`, async () => {
            await w.waitForTimeout(700);
            await w.mouse.click(p.x, p.y, { button: 'right' });
        });
        // 「3. Create SYMM mol... を選びます」
        await w.waitForTimeout(700);
        await pickNextContextItem(harness.app, ['Create SYMM mol...']);
        await w.mouse.click(p.x, p.y, { button: 'right' });
        // 「4. 新しい Object の名前と Renderer の種類を指定して Create を押します」
        const dlg = w.locator('.bp5-dialog').filter({ hasText: 'New Renderer' }).last();
        await expect(dlg).toBeVisible();
        await expect(dlg.locator('input').first()).toHaveValue(`${OBJ} ${symop}`);
        await docShot(w, `${SHOT}/5-create-symm`, { clip: dlg });
        await dlg.getByRole('button', { name: 'Create', exact: true }).click();
        await expect(dlg).toBeHidden();
        // 「対称操作を適用した座標を持つ新しい分子 Object が作られます」
        await openSidebarView(w, 'explorer');
        await expectRow(w, `${OBJ} ${symop}`);
    });

    test('6. 表示を調整・解除する', async () => {
        const w = harness.window;
        // 「目のアイコンで非表示にします」
        await toggleRowVisibility(w, 'symm');
        await expect(rowVisibilityToggle(w, 'symm')).toHaveClass(/hidden/);
        await toggleRowVisibility(w, 'unitcell');
        await expect(rowVisibilityToggle(w, 'unitcell')).toHaveClass(/hidden/);
    });
});
