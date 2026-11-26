import { expect, type Locator, type Page } from '@playwright/test';
import type { ElectronApplication } from 'playwright';
import type { CueMolHarness } from './app';
import { LYSOZYME } from './course';
import { setupSelectionPage } from './courseSelection';
import { clickDialogButton, dialog, expectDialogClosed } from '../helpers/dialogs';
import { fieldControl, fieldRow } from '../helpers/form';
import { expectRow, sceneRow, toggleRowVisibility } from '../helpers/sceneTree';
import { pickNextContextItem } from '../helpers/popupMenu';
import { openSidebarView } from '../helpers/sidebar';

/**
 * renderers.md of the basic course: New Renderer for the selected residues
 * and for the whole molecule, and the range change of ballstick1. Later
 * pages (coloring.md) start from the state these steps leave.
 *
 * The scene tree's context menu is a native menu on macOS; the context-menu
 * driver (helpers/popupMenu.ts) picks its items by their real labels.
 */

export interface NewRendererHooks {
    onDialog?: (dlg: Locator) => Promise<void>;
}

async function openNewRenderer(app: ElectronApplication, window: Page): Promise<Locator> {
    // 「シーンツリーで lysozyme を右クリックし、New Renderer を選びます」
    await openSidebarView(window, 'explorer');
    await pickNextContextItem(app, ['New Renderer…']);
    await sceneRow(window, LYSOZYME).click({ button: 'right' });
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
    async addBallstick(app: ElectronApplication, window: Page, hooks: NewRendererHooks = {}): Promise<void> {
        const dlg = await openNewRenderer(app, window);
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
    async addRibbon(app: ElectronApplication, window: Page, hooks: NewRendererHooks = {}): Promise<void> {
        const dlg = await openNewRenderer(app, window);
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

    /** §3: select residues 2-7 in Mol Struct, then ballstick1 > Change sel > Current. */
    async widenBallstick(app: ElectronApplication, window: Page): Promise<void> {
        await setupSelectionPage.pickResidues(window, 2, 7);
        await setupSelectionPage.applyMolStruct(window);
        await openSidebarView(window, 'explorer');
        await pickNextContextItem(app, ['Change sel', 'Current']);
        await sceneRow(window, 'ballstick1').click({ button: 'right' });
    },

    async run(harness: CueMolHarness): Promise<void> {
        await setupSelectionPage.run(harness.window);
        await this.addBallstick(harness.app, harness.window);
        await this.addRibbon(harness.app, harness.window);
        await this.hideSimple(harness.window);
        await this.widenBallstick(harness.app, harness.window);
    },
};
