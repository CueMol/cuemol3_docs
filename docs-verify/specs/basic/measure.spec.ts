/**
 * Doc: docs/ja/tutorials/basic/measure.md (基本操作コース 6 ページ目)
 *
 * Starts from the end state of loading.md (lysozyme, simple) and mirrors
 * the page's numbered h2 sections.
 *
 * The page's two existing figures (distance.webp / dashed-stick1.webp) were
 * made by hand and are left as they are; this spec does not shoot them.
 *
 * Atoms are clicked at points near the view centre found with the context
 * menu (it lists the atom items only over an atom). The scene tree's
 * context menu is native on macOS; the context-menu driver picks its items
 * by label (helpers/popupMenu.ts).
 */
import { test, expect, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME } from '../../fixtures/course';
import { assertDialogQueuesEmpty, dialog } from '../../helpers/dialogs';
import { expectRow, rowVisibilityToggle, sceneRow, sceneToolbarButtons, toggleRowVisibility } from '../../helpers/sceneTree';
import { clearLastContextLabels, lastContextLabels, pickNextContextItem } from '../../helpers/popupMenu';
import { openSidebarView } from '../../helpers/sidebar';
import { runConsole, clearConsole } from '../../helpers/console';
import { aroundBox, docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/measure';
const DOC = 'docs/ja/tutorials/basic/measure.md';

let harness: CueMolHarness;

type Pt = { x: number; y: number };

/** A click the view does not pair with an earlier one (500 ms window). */
async function click(w: Page, p: Pt, button: 'left' | 'right' = 'left'): Promise<void> {
    await w.waitForTimeout(700);
    await w.mouse.click(p.x, p.y, { button });
}

/** Points near the view centre that lie on atoms, at least `minGap` px apart. */
async function findAtomPoints(w: Page, n: number, minGap = 25): Promise<Pt[]> {
    const box = (await w.locator('canvas').evaluateAll((cs) => cs
        .map((c) => c.getBoundingClientRect())
        .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }))
        .sort((a, b) => b.width * b.height - a.width * a.height)[0]))!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const found: Pt[] = [];
    for (let r = 0; r <= 120 && found.length < n; r += 15) {
        for (const [ux, uy] of [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
            if (r === 0 && (ux || uy)) continue;
            const p = { x: Math.round(cx + ux * r), y: Math.round(cy + uy * r) };
            if (found.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < minGap)) continue;
            await clearLastContextLabels(harness.app);
            await click(w, p, 'right');
            await w.waitForTimeout(300);
            if ((await lastContextLabels(harness.app)).includes('Select Atom')) found.push(p);
            if (found.length >= n) break;
        }
    }
    if (found.length < n) throw new Error(`[docs-verify] found ${found.length} atom points, need ${n}`);
    return found;
}

function tool(w: Page, label: string) {
    return w.locator('.viewport-tool-palette').getByRole('button', { name: label });
}

async function interactionLines(w: Page): Promise<string[]> {
    const out = await runConsole(w, `list_interactions ${LYSOZYME}/measure`);
    return out.join('\n').split('\n').filter((l) => /distance|angle|torsion/i.test(l));
}

test.describe.serial('計測と相互作用の表示', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
        await setupLoadingPage.loadLysozyme(harness);
        await runConsole(harness.window, `focus ${LYSOZYME}`);
        await clearConsole(harness.window);
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

    test('1. 距離を測る', async () => {
        const w = harness.window;
        const [p1, p2] = await findAtomPoints(w, 2);
        // 「1. ツールパレットで Distance ツールを選びます (ショートカット D)」
        const distance = tool(w, 'Distance (D)');
        await distance.click();
        await expect(distance).toHaveAttribute('aria-pressed', 'true');
        await docShot(w, `${SHOT}/1-tool-palette`, {
            rect: await aroundBox(w, w.locator('.viewport-tool-palette'), 90),
            highlight: distance,
        });
        // 「2. 距離を測りたい 1 つめの原子をクリックします」「3. 2 つめの原子をクリックすると、
        //   原子間に点線が引かれ、距離のラベルが表示されます」
        await click(w, p1);
        await click(w, p2);
        await expectRow(w, 'measure');
        await expect.poll(async () => (await interactionLines(w)).length).toBe(1);
        await clearConsole(w);
        // 「途中でやめたいときは Esc を押すか、Navigate など他のツールに切り替えます」
        await tool(w, 'Navigate (N)').click();
        await expect(tool(w, 'Navigate (N)')).toHaveAttribute('aria-pressed', 'true');
    });

    test('2. 角度と二面角を測る', async () => {
        const w = harness.window;
        // 「Angle ツール (A)」「Torsion ツール (T)」
        await expect(tool(w, 'Angle (A)')).toBeVisible();
        await expect(tool(w, 'Torsion (T)')).toBeVisible();
    });

    test('3. 計測表示の正体 — atomintr Renderer', async () => {
        const w = harness.window;
        // 「measure という名前の atomintr Renderer が自動で作られている」
        await openSidebarView(w, 'explorer');
        await expect(w.getByText('measure (atomintr)', { exact: true })).toBeVisible();
        await docShot(w, `${SHOT}/3-measure-row`, {
            rect: await sidebarRect(w, sceneRow(w, 'measure'), 40),
            highlight: sceneRow(w, 'measure').locator('xpath=ancestor::div[contains(@class, "bp5-tree-node-content")]'),
        });
        // 「目のアイコンで、計測表示だけを一時的に隠せます」
        await toggleRowVisibility(w, 'measure');
        await expect(rowVisibilityToggle(w, 'measure')).toHaveClass(/hidden/);
        await toggleRowVisibility(w, 'measure');
        // 「行を選んで Delete を押せば、計測表示をまとめて削除できます」(the button only)
        await expect(sceneToolbarButtons(w)).toHaveCount(4);
        // 「Measure グループのオプションのつまみを開くと、ラベルセットを選べます」
        const cap = w.getByRole('button', { name: 'Measure options' });
        await cap.click();
        const pop = w.locator('.measure-options-popover');
        await expect(pop).toBeVisible();
        await expect(pop.getByText('Target label set', { exact: true })).toBeVisible();
        await expect(pop.locator('.measure-options-row', { hasText: 'measure' })).toBeVisible();
        await docShot(w, `${SHOT}/3-measure-options`, {
            rect: await aroundBox(w, [w.locator('.viewport-tool-palette'), pop], 16),
            highlight: pop,
        });
        // The popover closes on a click outside it (Escape does not).
        await w.mouse.click(1, 1);
        await expect(pop).toBeHidden();
    });

    test('4. 見た目をスタイルで整える', async () => {
        const w = harness.window;
        // 「1. シーンツリーで measure (atomintr) を右クリックします」「2. Style > Dashed stick1 を選びます」
        await pickNextContextItem(harness.app, ['Style', 'Dashed stick1']);
        await sceneRow(w, 'measure').click({ button: 'right' });
        const out = await runConsole(w, `get ${LYSOZYME}/measure.style`);
        expect(out.join('\n')).toMatch(/DashedStick1/i);
        await clearConsole(w);
    });

    test('5. 計測項目を個別に削除する', async () => {
        const w = harness.window;
        // 「1. measure (atomintr) を右クリックし、Edit interaction list... を選びます」
        await pickNextContextItem(harness.app, ['Edit interaction list…']);
        await sceneRow(w, 'measure').click({ button: 'right' });
        // 「2. その Renderer に属する計測 (相互作用) の一覧が表示されます」
        const dlg = dialog(w, /^Edit interaction list/);
        await expect(dlg).toBeVisible();
        const del = dlg.getByRole('button', { name: /^Delete interaction / });
        await expect(del).toHaveCount(1);
        await docShot(w, `${SHOT}/5-edit-list`, { clip: dlg, highlight: del.first() });
        // 「3. 不要な行を選んで削除します」
        await del.first().click();
        await expect(del).toHaveCount(0);
        // 「4. OK を押して閉じます」
        await dlg.getByRole('button', { name: 'OK', exact: true }).click();
        await expect(dlg).toBeHidden();
        expect(await interactionLines(w)).toHaveLength(0);
        await clearConsole(w);
    });
});
