# Portfolio — priyanshusah.com

A high-performance personal portfolio built with React, Vite, and Tailwind CSS. Features cinematic looping backgrounds, an ambient lo-fi music player, a 3D interactive cube, LinkedIn-powered blog with Gemini LLM processing, and smooth page transitions — all running at 60fps.

## ✨ Features

### Pages
| Page | Description |
|---|---|
| **Home** | Animated landing with rotating background media and 3D cube |
| **About** | Personal bio and introduction |
| **Journey** | Interactive timeline of career milestones, education, and experiences |
| **Skills** | Technical skills matrix with visual indicators |
| **Services** | Consulting, prototyping, and deployment capabilities |
| **Portfolio** | Swiper.js carousel showcasing featured projects with detail views |
| **Socials** | LinkedIn blog feed with tag filtering, search, and markdown rendering |
| **Mail** | Contact form and collaboration routes |

### Interactive Elements
- **Cinematic Backgrounds** — 10 unique looping video environments with day/night modes, parallax on desktop, randomized per session
- **Lo-fi Music Player** — Ambient background music with mini player controls across all pages
- **3D Cube** — Interactive Three.js element on the home page
- **Blog System** — Posts scraped from LinkedIn, transformed via Gemini LLM, filterable by tags
- **URL Shortener** — Slugs like `/linkedin`, `/github`, `/resume-global` act as branded short links
- **Wallpaper Selector** — Choose from multiple background themes with smooth transitions
- **Dark/Light Mode** — Theme toggle with persistent preference

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (required by Vite 5)
- npm

### Installation
```bash
npm install
```

### Scripts
```bash
npm run dev       # Start dev server (http://localhost:5173, exposed to network)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run login     # One-time manual login to Playwright ScraperProfile
npm run update    # Run LinkedIn scraper (scrapes + downloads media + LLM processes)
```

## 📁 Project Structure

```
├── public/
│   ├── assets/                    # Images, videos, backgrounds
│   ├── data/blogs_v2.json         # LinkedIn blog posts (auto-generated)
│   ├── media/                     # Locally downloaded LinkedIn images, GIFs, and videos
│   ├── favicons/                  # Site favicons
│   ├── fonts/                     # Custom font files
│   ├── robots.txt                 # SEO crawler config
│   └── sitemap.xml                # Sitemap for search engines
├── src/
│   ├── components/
│   │   ├── HeaderBackground.jsx   # Cinematic background media loader
│   │   ├── LofiPlayer.jsx         # Full lo-fi music player
│   │   ├── MiniPlayer.jsx         # Compact player controls
│   │   ├── Cube.jsx               # 3D interactive cube
│   │   ├── BlogHeader.jsx         # Blog section header and search
│   │   ├── PostCard.jsx           # Blog post card component
│   │   ├── DetailView.jsx         # Full blog post reader with markdown
│   │   ├── FilterSidebar.jsx      # Tag-based blog filtering
│   │   ├── FooterNavbar.jsx       # Bottom navigation bar
│   │   ├── SocialBar.jsx          # Floating social media links
│   │   └── SvgLoaderLeftToRight.jsx # Page transition animations
│   ├── pages/                     # Route-level page components
│   ├── styles/
│   │   └── main.css               # Global styles and animations
│   ├── App.jsx                    # Application shell and layout
│   ├── main.jsx                   # React entry point
│   └── router.jsx                 # React Router configuration
├── scripts/
│   └── linkedin-scraper/          # Node.js Playwright scraper + Gemini LLM
├── index.html                     # HTML shell with SEO meta tags
└── vite.config.js                 # Vite configuration
```

## 🎬 Background Media

- Controlled via `public/assets/images/backgrounds/backgrounds.json`
- Each entry maps a still image to a looping video
- Stills load instantly → videos fade in once buffered
- Randomized per session with localStorage dedup
- 10 unique scenes, each with day and night variants

## 🔗 URL Shortener

Static redirects in `public/<slug>/index.html` make the portfolio double as a branded short-link service:

`/linkedin` · `/github` · `/mail` · `/resume-global` · `/twitch` · `/spotify` · `/steam` · `/discord` · `/codolio`

## 📝 LinkedIn Blog Scraper

An automated pipeline in `scripts/linkedin-scraper/` that:
1. Scrapes posts from LinkedIn using Playwright Chromium
2. Transforms content via Gemini LLM (title, summary, markdown, curated tags)
3. Downloads all media attachments (images, GIFs, `.mp4`/`.webm` videos) to `public/media/`
4. Supports incremental updates — only new posts hit the LLM
5. Outputs to `public/data/blogs_v2.json`

See [`scripts/linkedin-scraper/README.md`](scripts/linkedin-scraper/README.md) for setup details.

## 🌐 SEO

- `robots.txt` allows major crawlers with sitemap reference
- `sitemap.xml` points to canonical URL (`https://priyanshusah.com/`)
- `index.html` includes Open Graph, Twitter Card, and Schema.org Person metadata

## 🚢 Deployment

1. `npm run build`
2. Deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages)
3. Ensure `public/assets/` is included in the build output

### Links
- [Production](https://priyanshusah.com) — Vercel
- [Dev](https://dev.priyanshusah.com/) — Vercel

## Credits

- Inspiration: [James Oliver Portfolio](https://james-oliver-portfolio.netlify.app/)
- Backgrounds: Video loops sourced from Steam Wallpaper Engine Workshop — credit to the original artists
- Music: Lo-fi tracks credit to the original artists

## Roadmap

- [x] Currently no planned updates
