# Portfolio

A Vite-powered personal portfolio showcasing key projects, services, and testimonials on a single-page experience. The site blends Bootstrap 5 styling with custom animations, dynamic background media, and Swiper.js carousels to create an interactive presentation.

- Single-page layout with quick navigation between `home`, `about`, `quality`, `skills`, `services`, `portfolio`, `reviews`, and `contact` sections.
- Background stills load instantly from `public/assets/images/backgrounds/backgrounds.json`, and matching videos fade in once buffered, with optional parallax for desktop visitors.
- Swiper.js sliders highlight portfolio work and client reviews, adapting automatically to varying screen widths.
- Staged background loader shows the paired still immediately and fades in the video once buffered, keeping the first paint fast.
- Bootstrap bundle is imported locally so data attributes (e.g. tooltips, dropdowns) work without additional setup.

## About Priyanshu Sah

Hi, I'm Priyanshu Sah an AI/ML engineer and full-stack developer focused on shipping production-ready machine learning systems, cloud-native applications, and end-to-end product experiences. My work spans data science research, model deployment, React + Node.js development, and MLOps automation.

### Core Expertise

- Designing intelligent products with Python, TensorFlow, PyTorch, and scikit-learn.
- Building full-stack web apps with React, Node.js, Express, and TypeScript.
- Automating data pipelines, CI/CD, and containerized workloads across AWS, Azure, and GCP.
- Translating business goals into measurable ML metrics, dashboards, and user-facing experiences.

### What You'll Find Here

- Featured AI/ML case studies and engineering projects.
- Skills matrix covering machine learning, data engineering, and full-stack development.
- Services section outlining consulting, prototyping, and deployment capabilities.
- Contact routes for collaborations, speaking opportunities, and mentorship.

> SEO keywords intentionally woven throughout this README include: *AI engineer*, *machine learning engineer*, *data scientist*, *MLOps specialist*, *full-stack developer*, *cloud architect*, and *Priyanshu Sah portfolio*.

## Roadmap

* [x] **Compress and optimize videos** for seamless looping; trim clips as needed for performance.
* [ ] **Build richer animations** for text, form fields, hover states, and transforms.
* [x] **Implement blurred content reveal** for the About page with smooth load and unblur behavior.
* [ ] **Enhance Journey scroll experience**:

  * Add down-arrow scroll prompt.
  * Enable container scroll with one visible entry at a time.
  * Add disintegration + blur transition (old fades, new emerges).
  * Simplify mobile view to max two visible cards.
* [ ] **Add a scroll-linked progress bar** tied to the Journey section.
* [ ] **Create gradient light-follow effect** for navbar pointer.
* [ ] **Animate Preload animation ** using stroke-by-stroke SVG animation of "Priyanshu Sah".
* [ ] **Refresh project cards** with improved UI, reveal animations, and animated border effects.
* [ ] **Add scrolling feed** for blog and LinkedIn posts; link posts directly to the website (not GitHub).
* [ ] **Expand Journey and Project sections** with more detailed tech stack data.
* [ ] **Add Tech Stack listing** as a standalone section or integrated into projects.
* [ ] **Add small “refresh page” reminder** or animation cue for dynamic content.
* [ ] **Fix image aspect ratio (16:9)** and ensure consistent photo scaling (fit/fill).
* [ ] **Use TEMPEST logo in navbar** on compressing to a single line with logo in middle.
* [ ] **Create a global gradient overlay** for navbar and social bar that adapts across iOS and desktop devices.
* [ ] **Improve fallback and redirect handling** for invalid routes or offline states(Optional / use server side Redirect).
* [ ] **Implement Dark/Light mode ** for user preference based on system mode.
* [ ] ** Music player ** simialr to #2 Reference
* [ ] **Services Gradient background** anbd border animation 
* [ ] **Refactor entire project to React + Tailwind** for better maintainability and scalability.

Reference : [[1](https://www.rauliqbal.my.id/#about),[2](https://tranhuudat2004.github.io/blog.html),[3](https://theodorusclarence.com/),[4](https://www.abirthakur.com/),[5](https://portfolio-rho-one-93.vercel.app/),[Music](https://open.spotify.com/track/10FzVK0cj8of3oGw2ALYOC?si=d382f8ca65bd4fc6 - Spotfiy embeed code comented out below]

<!-- <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/2L74PiwfbQFS1QNs4XAGYj?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe> -->
## Getting Started

### Prerequisites

- Node.js 18 or newer (required by Vite 5).
- npm (bundled with Node) or a compatible package manager.

### Installation

```bash
npm install
```

### Useful Scripts

```bash
npm run dev      # Start the local development server on http://localhost:5173
npm run build    # Generate a production build in the dist/ directory
npm run preview  # Preview the production build locally
```

If you need to test from another device on your network, run `npm run dev -- --host`.

## Project Structure

```
.
public/
  assets/
    images/backgrounds/        # Still images referenced by backgrounds.json
    videos/backgrounds/        # Matching video files
src/
  scripts/                     # Behaviour: navigation logic, loaders, Swiper setup
  styles/                      # Main styles and icon font bundle
  main.js                      # Entry point wiring styles and scripts
index.html                     # Page markup and section content
vite.config.js                 # Vite configuration (default)
```

## Background Media

- Update `public/assets/images/backgrounds/backgrounds.json` to control which media files are considered for rotation.
- Each entry can be either a simple string (image-only background) or an object with `image` and `video` keys pointing to files in `public/assets/images/backgrounds/` and `public/assets/videos/backgrounds/`, respectively.
- Videos fade in after their paired still image is shown, so initial page load stays responsive while motion assets buffer in the background.
- Assets are selected at random on page load, avoiding repeats between sessions when possible thanks to localStorage caching.

## Customization Tips

- Edit section content and layout in `index.html`.
- Adjust component styling in `src/styles/main.css`; the build includes Bootstrap variables for consistency.
- Modify navigation behaviour, parallax thresholds, or Swiper options inside `src/scripts/main.js` and `src/scripts/swiper.js`.

## SEO Assets

- `public/robots.txt` allows major crawlers to index every section and advertises the sitemap endpoint.
- `public/sitemap.xml` lists the canonical portfolio URL (`https://priyanshusah.com/`) to help search engines discover updates quickly.
- `index.html` head metadata includes canonical, Open Graph, Twitter, and Schema.org Person tags tailored to AI/ML and full-stack keywords.

## URL Shortener & Aggregator

- Friendly slugs such as `/linkedin`, `/github`, `/mail`, `/codolio`, `/resume-global`, `/twitch`, `/spotify`, `/steam`, and `/discord` route through the portfolio, so a single change updates both the site UI and external share links.
- Each slug maps to a static redirect in `public/<slug>/index.html`, making the portfolio double as a lightweight URL shortener without server-side code.
- `index.html` references those slugs for social icons, ensuring outbound links remain consistent even if destination URLs change later.

## Deployment

1. Run `npm run build`.
2. Deploy the generated `dist/` folder to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).
3. Ensure `public/assets/` is copied alongside the build output so media and manifest files resolve correctly.

Feel free to adapt the content, color palette, or assets to tailor the portfolio for your own brand.

### Links
- [Production](https://priyanshusah.com) - Github Pages
- [Test](https://dev.priyanshusah.com) - Cloudflare Pages

## Credits

- Inspiration: [James Oliver Portfolio](https://james-oliver-portfolio.netlify.app/)
- Backgrounds: Video backgrounds sourced from the Steam Wallpaper Engine Workshop — credit to the original artists.
