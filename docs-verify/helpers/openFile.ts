import { expect, type Locator, type Page } from '@playwright/test';
import type { ElectronApplication } from 'playwright';
import { clickMenu } from './menu';
import { dialog, clickDialogButton, expectDialogClosed } from './dialogs';

/**
 * File > Get PDB... — the flow the docs describe: enter the accession code,
 * Download, then the "Open File Options" screen (object name / renderer
 * type) and Open.
 *
 * The two callbacks exist so documentation screenshots can be taken with the
 * dialogs filled in but not yet confirmed; they must not change the flow.
 */

const NET_TIMEOUT_MS = 60_000;

export interface GetPdbOptions {
    /** Accession code as typed by the reader (upper case in the docs). */
    id: string;
    /** Renderer type selected on the options screen. */
    rendType: string;
    /** Object name; omitted means "leave the default" (the lower-cased id). */
    objectName?: string;
    onGetPdbDialog?: (dlg: Locator) => Promise<void>;
    onOptionsDialog?: (dlg: Locator) => Promise<void>;
}

export async function getPdb(
    app: ElectronApplication,
    window: Page,
    opts: GetPdbOptions,
): Promise<void> {
    await clickMenu(app, ['File', 'Get PDB...']);
    const getPdbDialog = dialog(window, 'Get PDB');
    await expect(getPdbDialog).toBeVisible();
    await getPdbDialog.locator('#get-pdb-id').fill(opts.id);
    await opts.onGetPdbDialog?.(getPdbDialog);
    await clickDialogButton(window, 'Get PDB', 'Download');

    const options = dialog(window, 'Open File Options');
    await expect(options).toBeVisible({ timeout: NET_TIMEOUT_MS });
    if (opts.objectName !== undefined) {
        await options.locator('#rend-objname').fill(opts.objectName);
    }
    await options.locator('#rend-type').selectOption(opts.rendType);
    await opts.onOptionsDialog?.(options);
    await options.getByRole('button', { name: 'Open', exact: true }).click();
    await expectDialogClosed(window, 'Open File Options');
    await expectDialogClosed(window, /Downloading/);
}
