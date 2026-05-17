// LinkedIn Scraper Configuration
// Update these paths and settings for your system

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    // Chrome user data directory - this is where your logged-in profile lives
    // Windows default path shown below
    chromeProfilePath: 'C:/Users/priya/AppData/Local/Google/Chrome/ScraperProfile',

    // Chrome executable path (adjust if Chrome is installed elsewhere)
    chromeExecutablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',

    // Which Chrome profile to use (Default is the main profile)
    profileDirectory: 'Default',

    // Your LinkedIn activity URL
    linkedInActivityUrl: 'https://linkedin.com/in/priyanshu123sah/recent-activity/all/',

    // Output path for the scraped data
    outputPath: join(__dirname, '../../public/data/blogs_v2.json'),

    // Author info (used for all posts)
    author: {
        name: 'Priyanshu Sah',
        profileUrl: 'https://linkedin.com/in/priyanshu123sah'
    },

    // Scraping settings
    maxPosts: 0,               // Maximum number of posts to scrape (set to 0 for unlimited)
    scrollDelay: 1500,         // Delay between scrolls (ms)
    postClickDelay: 2000,      // Delay after clicking a post to load analytics (ms)
    headless: false,           // Set to true to run without visible browser

    // Debug settings
    debug: true,               // Enable console logging
    slowMo: 50                 // Slow down Puppeteer operations (ms) - helps with debugging
};
