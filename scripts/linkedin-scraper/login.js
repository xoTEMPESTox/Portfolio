// Open Playwright Chromium with ScraperProfile for manual LinkedIn login
// Run this ONCE to log into LinkedIn, then the scraper will use saved cookies

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const PROFILE_PATH = 'C:/Users/priya/AppData/Local/Google/Chrome/ScraperProfile';

if (!existsSync(PROFILE_PATH)) {
    mkdirSync(PROFILE_PATH, { recursive: true });
}

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║   Opening Playwright Browser for Manual Login             ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('\n1. Log into LinkedIn in the browser window');
console.log('2. Close the browser when done');
console.log('3. Run "npm run update" to start scraping\n');

const context = await chromium.launchPersistentContext(PROFILE_PATH, {
    headless: false,
    viewport: null
});

const page = await context.newPage();
await page.goto('https://www.linkedin.com/login');

console.log('✅ Browser opened! Log into LinkedIn and close the window.');
