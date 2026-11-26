import { expect, type Locator, type Page } from '@playwright/test';
import { LYSOZYME } from './course';
import { openSidebarView } from '../helpers/sidebar';

/**
 * selection.md of the basic course: the steps that later pages reuse to
 * reach "Val2-Phe3 (A.2:3.*) selected" and to select other residue ranges
 * in the Mol Struct panel (renderers.md §3).
 */

/** Selection view > Mol Struct pane (the one with the residue tree). */
export function molStructPane(window: Page): Locator {
    return window.locator('.sp-pane').filter({ has: window.getByText('Mol Struct', { exact: true }) }).first();
}

/** Selection view > Selection pane (the one with the builder). */
export function selectionPane(window: Page): Locator {
    return window.locator('.sp-pane.selection-pane').first();
}

async function pickMolecule(scope: Locator, name: string): Promise<void> {
    const sel = scope.getByRole('combobox', { name: 'Molecule' }).first();
    const v = await sel.locator('option').filter({ hasText: name }).first().getAttribute('value');
    if (v === null) throw new Error(`no molecule ${name}`);
    await sel.selectOption(v);
}

export const setupSelectionPage = {
    /** Selection pane step 1: choose the molecule. */
    async chooseMolecule(pane: Locator): Promise<void> {
        await pickMolecule(pane, LYSOZYME);
    },

    /**
     * Mol Struct: choose lysozyme, open chain A and pick residues first..last
     * (click the first, Shift+click the last), as the page describes.
     */
    async pickResidues(window: Page, first: number, last: number): Promise<void> {
        await openSidebarView(window, 'selection');
        const pane = molStructPane(window);
        await this.unfoldMolStruct(window);
        await pickMolecule(pane, LYSOZYME);
        const tree = pane.locator('.mol-tree');
        const chain = tree.locator('.bp5-tree-node-content').filter({ hasText: /^chain "A"/ }).first();
        await expect(chain).toBeVisible();
        const firstRow = tree.locator('.bp5-tree-node-content').filter({ hasText: new RegExp(`^${first} [A-Z]{3}$`) }).first();
        if (!(await firstRow.isVisible().catch(() => false))) {
            await chain.locator('.h3-tree-caret').click();
        }
        await expect(firstRow).toBeVisible();
        await firstRow.click();
        const lastRow = tree.locator('.bp5-tree-node-content').filter({ hasText: new RegExp(`^${last} [A-Z]{3}$`) }).first();
        await lastRow.click({ modifiers: ['Shift'] });
    },

    /** Collapse the Mol Struct pane (its header toggles it). */
    async foldMolStruct(window: Page): Promise<void> {
        await openSidebarView(window, 'selection');
        const pane = molStructPane(window);
        if ((await pane.locator('.mol-tree').count()) > 0) {
            await pane.locator('.section-title').first().click();
            await expect(pane.locator('.mol-tree')).toHaveCount(0);
        }
    },

    async unfoldMolStruct(window: Page): Promise<void> {
        await openSidebarView(window, 'selection');
        const pane = molStructPane(window);
        if ((await pane.locator('.mol-tree').count()) === 0) {
            await pane.locator('.section-title').first().click();
            await expect(pane.locator('.mol-tree')).toHaveCount(1);
        }
    },

    /** Mol Struct header's first button ("Select atoms"). */
    async applyMolStruct(window: Page): Promise<void> {
        await molStructPane(window).locator('.section-action-btn').first().click();
    },

    /** The page's end state: Val2-Phe3 selected. */
    async run(window: Page): Promise<void> {
        await this.pickResidues(window, 2, 3);
        await this.applyMolStruct(window);
    },
};
