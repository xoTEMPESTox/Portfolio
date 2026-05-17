# LinkedIn Posts Scraper

Scrapes LinkedIn posts and exports to `blogs_v2.json` format for the portfolio.
Uses Gemini LLM to transform raw LinkedIn posts into clean blog-style content and downloads all images, GIFs, and videos locally for permanent storage.

## Setup

```bash
npm install
cp scripts/linkedin-scraper/.env.example scripts/linkedin-scraper/.env   # Then add your Gemini API key
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for content transformation |
| `GEMINI_MODEL` | No | Model to use (default: `gemini-2.0-flash`) |

## Usage

### First-time login (One-Time Setup)
```bash
npm run login
```
Opens Playwright Chromium with a dedicated scraper profile (`ScraperProfile`). Log into LinkedIn manually in the window, then close the browser.

### Scrape & Update Posts
```bash
npm run update
```
Installs inner dependencies, launches your saved session, scrapes new posts, downloads media (images, GIFs, videos) to `public/media/`, and formats markdown via Gemini.

## How It Works

1. Launches Playwright Chromium with `ScraperProfile` (completely isolated from your everyday Chrome)
2. Navigates to your LinkedIn activity page (`in.linkedin.com`)
3. Scrolls to load all posts (clicks "Show more results" for pagination)
4. Extracts: text, images, videos, reactions, comments, shares, views, timestamps
5. Saves raw data to `raw_posts.json` (Phase 1)
6. Processes through Gemini LLM (Phase 2):
   - **New posts** → generates title, summary, clean markdown, and 5 curated tags
   - **Existing posts** → only updates metrics (likes, views, comments)
7. Downloads all media attachments (images, GIFs, `.mp4`/`.webm` videos) to `public/media/`
8. Saves final output to `public/data/blogs_v2.json`

## Project Structure

```
├── index.js          # Entry point & two-phase pipeline
├── scraper.js        # Browser automation & post extraction
├── formatter.js      # Data → blogs_v2.json format
├── llm.js            # Gemini LLM integration
├── config.js         # Paths & scraping settings
├── login.js          # One-time LinkedIn login helper
├── .env.example      # Environment variable template
└── .gitignore
```

## Roadmap

- [x] Gemini LLM content transformation
- [x] Incremental updates (only new posts processed)
- [x] Curated tag generation with existing tag reuse
- [x] "Show more results" pagination
- [x] Local media downloading (images, GIFs, videos)
- [ ] Scheduled runs (cron/Task Scheduler)
