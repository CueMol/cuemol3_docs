import { defineConfig } from '@playwright/test';

// Real-GL Electron app under test: a single app instance at a time.
export default defineConfig({
    testDir: './specs',
    workers: 1,
    fullyParallel: false,
    retries: 0,
    timeout: 120_000,
    expect: { timeout: 10_000 },
    reporter: [['list'], ['html', { open: 'never' }]],
    outputDir: './test-results',
});
