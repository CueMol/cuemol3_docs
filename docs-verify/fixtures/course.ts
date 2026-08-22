import type { Locator } from '@playwright/test';
import type { CueMolHarness } from './app';
import { getPdb } from '../helpers/openFile';

/**
 * The basic tutorial course (docs/ja/tutorials/basic/) is one continuous
 * scenario: each page starts from the state the previous page left behind.
 * The steps that build that state live here so a later page's spec can
 * reach its starting point without duplicating the earlier page's spec.
 *
 * Every function performs exactly what its page documents; if a page
 * changes, change it here and the page's own spec verifies the result.
 */

/** Object name the reader types on the loading page. */
export const LYSOZYME = 'lysozyme';
/** Second object; Get PDB derives the name from the file, i.e. lower case. */
export const SECOND_OBJ = '1g59';

interface ShotHooks {
    onGetPdbDialog?: (dlg: Locator) => Promise<void>;
    onOptionsDialog?: (dlg: Locator) => Promise<void>;
}

export const setupLoadingPage = {
    /** loading.md §1: Get PDB 1QIO as "lysozyme", renderer type simple. */
    async loadLysozyme(harness: CueMolHarness, hooks: ShotHooks = {}): Promise<void> {
        await getPdb(harness.app, harness.window, {
            id: '1QIO',
            objectName: LYSOZYME,
            rendType: 'simple',
            ...hooks,
        });
    },

    /** loading.md §3: Get PDB 1G59 with the default name, renderer type trace. */
    async loadSecondObject(harness: CueMolHarness, hooks: ShotHooks = {}): Promise<void> {
        await getPdb(harness.app, harness.window, {
            id: '1G59',
            rendType: 'trace',
            ...hooks,
        });
    },

    /** The whole page, for specs of later pages that start from its end state. */
    async run(harness: CueMolHarness): Promise<void> {
        await this.loadLysozyme(harness);
        await this.loadSecondObject(harness);
    },
};
