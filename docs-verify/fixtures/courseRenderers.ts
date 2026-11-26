import { expect, type Locator, type Page } from '@playwright/test';
import type { CueMolHarness } from './app';
import { LYSOZYME } from './course';
import { setupSelectionPage } from './courseSelection';
import { clickDialogButton, dialog, expectDialogClosed } from '../helpers/dialogs';
import { fieldControl, fieldRow } from '../helpers/form';
import { clickSceneToolbar, expectRow, selectRow, toggleRowVisibility } from '../helpers/sceneTree';
import { openSidebarView } from '../helpers/sidebar';
import { runConsole, clearConsole } from '../helpers/console';

/**
 * renderers.md of the basic course: New Renderer for the selected residues
 * and for the whole molecule, and the range change of ballstick1. Later
 * pages (coloring.md) start from the state these steps leave.
 *
 * The page opens New Renderer from the scene tree's context menu, which is
 * a native menu on macOS; the Scene pane's Add button opens the same
 * dialog for the selected Object.
 */

export interface NewRendererHooks {
    onDialog?: (dlg: Locator) => Promise<void>;
}

async function openNewRenderer(window: Page): Promise<Locator> {
    await openSidebarView(window, 'explorer');
    await selectRow(window, LYSOZYME);
    await clickSceneToolbar(window, 'add');
    const dlg = dialog(window, 'New Renderer');
    await expect(dlg).toBeVisible();
    return dlg;
}

async function uncheckField(scope: Locator, label: string): Promise<void> {
    const box = fieldRow(scope, label).locator('input[type="checkbox"]').first();
    if (await box.isChecked()) {
        await fieldRow(scope, label).locator('.h3-form-checkbox').first().click();
    }
    await expect(box).not.toBeChecked();
}

export const setupRenderersPage = {
    /** §1: ballstick for the current selection (A.2:3.*), name ballstick1. */
    async addBallstick(window: Page, hooks: NewRendererHooks = {}): Promise<void> {
        const dlg = await openNewRenderer(window);
        await fieldControl(dlg, 'Renderer type').selectOption('ballstick');
        // 「Selection には、現在の選択に対応する式 (A.2:3.*) が最初から入っています」
        await expect(fieldRow(dlg, 'Selection').locator('input[type="checkbox"]').first()).toBeChecked();
        await expect(dlg.getByPlaceholder('* (all atoms)')).toHaveValue(/^'?A'?\.2:3\.\*$/);
        // 「Renderer name には、使われていない名前 (ballstick1 など) が自動で提案されています」
        await expect(fieldControl(dlg, 'Renderer name')).toHaveValue('ballstick1');
        if (hooks.onDialog) await hooks.onDialog(dlg);
        await clickDialogButton(window, 'New Renderer', 'Create');
        await expectDialogClosed(window, 'New Renderer');
        await expectRow(window, 'ballstick1');
    },

    /** §2: ribbon for the whole molecule (Selection unchecked). */
    async addRibbon(window: Page, hooks: NewRendererHooks = {}): Promise<void> {
        const dlg = await openNewRenderer(window);
        await fieldControl(dlg, 'Renderer type').selectOption('ribbon');
        await uncheckField(dlg, 'Selection');
        if (hooks.onDialog) await hooks.onDialog(dlg);
        await clickDialogButton(window, 'New Renderer', 'Create');
        await expectDialogClosed(window, 'New Renderer');
        await expectRow(window, 'ribbon1');
    },

    /** §2 end: close simple1's eye. */
    async hideSimple(window: Page): Promise<void> {
        await openSidebarView(window, 'explorer');
        await toggleRowVisibility(window, 'simple1');
    },

    /**
     * §3: select residues 2-7 in Mol Struct, then make it ballstick1's range.
     * Change sel > Current is in the tree's native context menu; the page's
     * equivalent command applies the same expression.
     */
    async widenBallstick(window: Page): Promise<string> {
        await setupSelectionPage.pickResidues(window, 2, 7);
        await setupSelectionPage.applyMolStruct(window);
        const pane = window.locator('.sp-pane.selection-pane').first();
        await setupSelectionPage.chooseMolecule(pane);
        const input = pane.getByPlaceholder('Input selection command');
        await expect(input).toHaveValue(/2:7/);
        const expr = await input.inputValue();
        await runConsole(window, `set_renderer_selection ${LYSOZYME}/ballstick1, "${expr.replace(/"/g, '\\"')}"`);
        await clearConsole(window);
        return expr;
    },

    async run(harness: CueMolHarness): Promise<void> {
        await setupSelectionPage.run(harness.window);
        await this.addBallstick(harness.window);
        await this.addRibbon(harness.window);
        await this.hideSimple(harness.window);
        await this.widenBallstick(harness.window);
    },
};
