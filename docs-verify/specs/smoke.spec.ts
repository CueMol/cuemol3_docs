/**
 * Harness self-test: launch, readiness, quit recipes and restart, all
 * without network access. If this file is red, every scenario spec is
 * meaningless — fix the harness first.
 */
import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import { CueMolHarness } from '../fixtures/app';

const TINY_PDB = path.join(__dirname, '..', 'fixtures', 'data', 'tiny.pdb');

test('起動して準備完了し、変更なしでそのまま終了できる', async () => {
    const harness = await CueMolHarness.launch();
    const proc = harness.app.process();
    try {
        await expect(harness.window.locator('canvas').first()).toBeVisible();
    } finally {
        await harness.close();
    }
    expect(proc.exitCode).not.toBeNull();
});

test('未保存の変更があっても Don\'t Save 経路で終了できる', async () => {
    const harness = await CueMolHarness.launch({ extraFiles: [TINY_PDB] });
    const proc = harness.app.process();
    try {
        // argv-loaded file marks the scene dirty; the row shows up in the UI.
        await expect(harness.window.getByText('tiny', { exact: false }).first())
            .toBeVisible({ timeout: 30_000 });
    } finally {
        await harness.close();
    }
    expect(proc.exitCode).not.toBeNull();
});

test('restart で再起動して再び操作可能になる', async () => {
    const harness = await CueMolHarness.launch();
    try {
        await harness.restart();
        await expect(harness.window.locator('canvas').first()).toBeVisible();
    } finally {
        await harness.close();
    }
});
