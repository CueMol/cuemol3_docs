import { expect, type Locator, type Page } from '@playwright/test';
import { showBottomTab } from './bottomPanel';

/**
 * Bottom panel > Console. The mode switch is a SegmentField in
 * `.console-toolbar` (CueMol / PyMOL / ChimeraX), the input sits in
 * `.console-prompt`, and each output line is a `.console-line` in the
 * transcript.
 *
 * Specs also use it to read state the page describes but the GUI shows
 * only graphically (e.g. the number of interactions drawn), and, where a
 * page step cannot be driven (an atom click), to reach the same state with
 * the command the page's "同じことをコマンドで" section gives.
 */

export function consolePanel(window: Page): Locator {
    return window.locator('.console-panel').first();
}

export function consoleInput(window: Page): Locator {
    return consolePanel(window).locator('.console-prompt input, .console-prompt textarea').first();
}

/** Show the Console tab and select a mode by its button label. */
export async function useConsoleMode(window: Page, mode: 'CueMol' | 'PyMOL' | 'ChimeraX'): Promise<void> {
    await showBottomTab(window, 'Console');
    await consolePanel(window).locator('.console-toolbar').getByText(mode, { exact: true }).click();
}

/**
 * Run one line and return the transcript lines it produced. Waits until the
 * line count stops growing after the echo of the command appears.
 */
export async function runConsole(window: Page, line: string): Promise<string[]> {
    await showBottomTab(window, 'Console');
    const lines = consolePanel(window).locator('.console-transcript .console-line');
    const before = await lines.count();
    const input = consoleInput(window);
    await input.fill(line);
    await input.press('Enter');
    await expect.poll(async () => lines.count(), { timeout: 60_000 }).toBeGreaterThan(before);
    // Let the command finish (the running indicator goes away).
    await expect(consolePanel(window).locator('.console-running')).toHaveCount(0, { timeout: 120_000 });
    const all = await lines.allInnerTexts();
    return all.slice(before);
}

/** Empty the transcript (the toolbar's Clear button). */
export async function clearConsole(window: Page): Promise<void> {
    await consolePanel(window).getByRole('button', { name: 'Clear console' }).click();
}
