import { test, expect } from '@playwright/test';

test('index page shows a japanese sentence and a button to show the english translation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/settings');
    await page.getByRole('button', { name: 'Save Settings' }).click(); 
    await expect(page.getByTestId('japanese-sentence')).not.toBeEmpty();
    await page.getByRole('button', { name: 'Show Answer' }).click(); 
    await expect(page.getByTestId('english-sentence')).not.toBeEmpty(); 
});