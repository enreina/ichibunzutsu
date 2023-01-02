import { test, expect } from '@playwright/test';

test('homepage redirects to /settings', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/settings');
});