/**
 * Doc: docs/ja/tutorials/basic/selection.md (基本操作コース 2 ページ目)
 *
 * Starts from the end state of loading.md (lysozyme + 1g59) and mirrors the
 * page's numbered h2 sections.
 *
 * §1 and §2 act on whichever atom lies under a point near the view centre
 * (found by opening the context menu there: it lists the atom items only
 * over an atom). The context menu is native on macOS; the context-menu
 * driver picks its items by label (helpers/popupMenu.ts).
 */
import { test, expect, type Locator, type Page } from '@playwright/test';
import { CueMolHarness } from '../../fixtures/app';
import { setupLoadingPage, LYSOZYME } from '../../fixtures/course';
import { setupSelectionPage, molStructPane, selectionPane } from '../../fixtures/courseSelection';
import { assertDialogQueuesEmpty } from '../../helpers/dialogs';
import { openSidebarView } from '../../helpers/sidebar';
import { clearLastContextLabels, lastContextLabels, pickNextContextItem } from '../../helpers/popupMenu';
import { nativeMenuShot } from '../../helpers/nativeShot';
import { runConsole, clearConsole } from '../../helpers/console';
import { docShot, sidebarRect } from '../../helpers/docShot';

const SHOT = 'tutorials/basic/selection';
const DOC = 'docs/ja/tutorials/basic/selection.md';

let harness: CueMolHarness;

/**
 * The molecule's current selection, as the Selection pane shows it ("Selection
 * 欄に、その分子の現在の選択が選択式として表示されます"), counted in atoms.
 */
async function selectedAtoms(w: Page): Promise<number> {
    await openSidebarView(w, 'selection');
    const pane = selectionPane(w);
    await setupSelectionPage.chooseMolecule(pane);
    const expr = await pane.getByPlaceholder('Input selection command').inputValue();
    if (expr.trim() === '') return 0;
    return countOf(w, expr);
}

async function countOf(w: Page, sel: string): Promise<number> {
    const out = await runConsole(w, `count ${LYSOZYME}, "${sel.replace(/"/g, '\\"')}"`);
    return Number(/atomCount: (\d+)/.exec(out.join('\n'))?.[1] ?? -1);
}

let atom: { x: number; y: number };

/** A right click that the view does not pair with an earlier click. */
async function rightClick(w: Page, p: { x: number; y: number }): Promise<void> {
    await w.waitForTimeout(700);
    await w.mouse.click(p.x, p.y, { button: 'right' });
}

/**
 * Two clicks a moment apart: the view tells a double click from the time
 * between clicks, and Playwright's dblclick leaves none.
 */
async function doubleClick(w: Page, p: { x: number; y: number }): Promise<void> {
    // Any click within 500 ms before (MouseEventHandler::DBLCLICK_TIME) would
    // pair with the first one, so start after a pause.
    await w.waitForTimeout(700);
    await w.mouse.click(p.x, p.y);
    await w.waitForTimeout(120);
    await w.mouse.click(p.x, p.y);
}

/**
 * A point near the view centre that lies on a lysozyme atom: the context
 * menu there lists the atom items (Select Atom, ...) only over an atom. With
 * no pick queued the driver dismisses the menu at once.
 */
async function findAtomPoint(w: Page): Promise<{ x: number; y: number }> {
    const box = (await w.locator('canvas').evaluateAll((cs) => cs
        .map((c) => c.getBoundingClientRect())
        .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }))
        .sort((a, b) => b.width * b.height - a.width * a.height)[0]))!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    for (const [dx, dy] of [[0, 0], [12, 8], [-14, 6], [8, -16], [-20, -12], [24, 20], [-26, 18], [30, -24]]) {
        await clearLastContextLabels(harness.app);
        await rightClick(w, { x: cx + dx, y: cy + dy });
        await w.waitForTimeout(400);
        if ((await lastContextLabels(harness.app)).includes('Select Atom')) return { x: cx + dx, y: cy + dy };
    }
    throw new Error('[docs-verify] no atom found near the view centre');
}

function builder(pane: Locator): Locator {
    return pane.locator('.selbuilder').first();
}

test.describe.serial('分子の一部の選択', { tag: '@net' }, () => {
    test.beforeAll(async () => {
        harness = await CueMolHarness.launch();
        await setupLoadingPage.run(harness);
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

    test('1. ダブルクリックで選択する', async () => {
        const w = harness.window;
        await runConsole(w, `focus ${LYSOZYME}`);
        await clearConsole(w);
        atom = await findAtomPoint(w);
        // 「分子ビューで原子をダブルクリックすると、その残基が選択されます」
        await doubleClick(w, atom);
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBeGreaterThan(0);
        const pane = selectionPane(w);
        const expr = await pane.getByPlaceholder('Input selection command').inputValue();
        // One residue: the selection is unchanged when widened to whole residues.
        expect(await countOf(w, `byres (${expr})`)).toBe(await countOf(w, expr));
        // 「選択済みの残基をもう一度ダブルクリックすると解除されます」
        await doubleClick(w, atom);
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(0);
        await clearConsole(w);
    });

    test('2. 右クリックメニューで選択する', async () => {
        const w = harness.window;
        // 「原子の上で右クリックすると、選択に関する項目が並んだメニューが開きます」
        await clearLastContextLabels(harness.app);
        await rightClick(w, atom);
        await expect.poll(() => lastContextLabels(harness.app)).toContain('Select Atom');
        const labels = await lastContextLabels(harness.app);
        for (const l of ['Select Atom', 'Select Residue', 'Select Chain', 'Select Molecule',
            'Add Select Atom', 'Add Select Residue', 'Add Select Chain',
            'Unselect', 'Invert Selection', 'Toggle Sidechain', 'Around', 'Around Byres', 'Center at this atom']) {
            expect(labels).toContain(l);
        }
        // The real (native) menu, captured from the screen.
        await w.mouse.move(atom.x, atom.y);
        await nativeMenuShot(harness.app, w, `${SHOT}/2-context-menu`, () => rightClick(w, atom));
        // 「ともかく分子全体を選択したいときは Select Molecule」
        await pickNextContextItem(harness.app, ['Select Molecule']);
        await rightClick(w, atom);
        const all = await countOf(w, '*');
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(all);
        // 「まっさらに戻したいときは Unselect」
        await pickNextContextItem(harness.app, ['Unselect']);
        await rightClick(w, atom);
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(0);
        await clearConsole(w);
    });

    test('3. Mol Struct パネルで選択する', async () => {
        const w = harness.window;
        await openSidebarView(w, 'selection');
        const pane = molStructPane(w);
        // 「1. パネル上部で対象の分子 (lysozyme) を選びます」
        // 「2. ... 残基 Val2 と Phe3 を選びます」
        await setupSelectionPage.pickResidues(w, 2, 3);
        // Picking rows alone does not select anything yet.
        expect(await selectedAtoms(w)).toBe(0);
        // 「3. パネルの見出しの右にある Select atoms ボタンを押すと、分子の対応する部分が選択されます」
        await setupSelectionPage.applyMolStruct(w);
        const want = await countOf(w, 'A.2:3.*');
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(want);
        await clearConsole(w);
        await openSidebarView(w, 'selection');
        await docShot(w, `${SHOT}/3-molstruct`, {
            rect: await sidebarRect(w, [pane.locator('.sp-section-header').first(), pane.getByText('3 PHE', { exact: true })], 60),
            highlight: pane.locator('.section-action-btn').first(),
        });
        // 「Zoom at は中央に寄せたうえで範囲の大きさに合わせて拡大します」— used
        // here so the selection highlight (the page's opening figure) is visible.
        await pane.locator('.section-action-btn').nth(2).click();
        await w.waitForTimeout(800);
        await docShot(w, `${SHOT}/0-highlight`);
    });

    test('4. Selection パネルと選択ビルダー', async () => {
        const w = harness.window;
        await openSidebarView(w, 'selection');
        const pane = selectionPane(w);
        // The Mol Struct tree above would fill the figures of this section;
        // fold it so the Selection pane sits under the view's title.
        await setupSelectionPage.foldMolStruct(w);
        // 「1. Molecule で対象の分子 (lysozyme) を選びます」
        await setupSelectionPage.chooseMolecule(pane);
        // 「2. Selection 欄に、その分子の現在の選択が選択式として表示されます」
        const input = pane.getByPlaceholder('Input selection command');
        await expect(input).not.toHaveValue('');

        await test.step('選択ビルダーで組み立てる', async () => {
            const b = builder(pane);
            // 「Named タブで protein をクリック」
            await b.getByRole('radio', { name: 'Named', exact: true }).click();
            const protein = b.locator('.selbuilder-menu .bp5-menu-item').filter({ hasText: /^protein/ }).first();
            await docShot(w, `${SHOT}/4-named`, {
                rect: await sidebarRect(w, protein, 100),
                highlight: protein,
            });
            await protein.click();
            await expect(input).toHaveValue('protein');
            // 「続けて Mod タブで Invert を押してみてください ... 水分子とイオン (Na+ と Cl-)
            //   だけが選択された状態」— 1QIO has one NA and two CL.
            await b.getByRole('radio', { name: 'Mod', exact: true }).click();
            const invert = b.locator('button').filter({ has: w.locator('.selbuilder-op-label', { hasText: /^Invert$/ }) }).first();
            await docShot(w, `${SHOT}/4-mod`, {
                rect: await sidebarRect(w, invert, 120),
                highlight: invert,
            });
            await invert.click();
            const water = await countOf(w, 'water or resn NA or resn CL');
            await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(water);
            await clearConsole(w);
        });

        await test.step('選択式を直接書く', async () => {
            await openSidebarView(w, 'selection');
            // 「手順 3 と同じ Val2〜Phe3 は次の式です。A.2:3.*」
            await input.fill('A.2:3.*');
            // 「手で入力した式は、欄の下の Apply selection ボタンを押すか Enter を押して適用します」
            const apply = pane.getByRole('button', { name: 'Apply selection' });
            await docShot(w, `${SHOT}/4-expression`, {
                rect: await sidebarRect(w, [pane.locator('.sp-section-header').first(), pane.locator('.selection-actions')], 40),
                highlight: [input, apply],
                mergeHighlight: false,
            });
            await apply.click();
            // 「次のページで使うので、Val2〜Phe3 (A.2:3.*) を選択した状態に」
            const want = await countOf(w, 'A.2:3.*');
        await expect.poll(() => selectedAtoms(w), { timeout: 15_000 }).toBe(want);
            await clearConsole(w);
        });
    });
});
