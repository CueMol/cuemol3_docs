import type { Page } from '@playwright/test';

/**
 * Hook for the future documentation-screenshot pipeline. Specs call this at
 * every point matching a `TODO(screenshot)` marker in the docs, so the
 * capture order is already woven into the scenarios; the body stays a no-op
 * until the docs-import pipeline (resize + WebP + 300 KB budget) exists.
 *
 * id convention: "<docs page slug>/<section>-<content>", e.g.
 * "getting-started/quick-tour/2-getpdb".
 */
export async function docShot(_window: Page, _id: string): Promise<void> {
    // Intentionally empty (phase 1). See docs-verify/README.md.
}
