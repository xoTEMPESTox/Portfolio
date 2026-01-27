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
  assets/                      # Media assets (images, videos, etc.)
  favicons/                    # Site favicons
  fonts/                       # Custom font assets
src/
  components/                  # Reusable UI components (LofiPlayer, Cube, etc.)
  pages/                       # Page-level components (Home, About, etc.)
  styles/                      # CSS modules and global styles
  App.jsx                      # Main application shell and layout
  main.jsx                     # React entry point
  router.jsx                   # React Router configuration
  AnimatedOutlet.jsx           # Page transition logic
index.html                     # HTML shell
vite.config.js                 # Vite configuration
tailwind.config.js             # Tailwind CSS configuration
```

## Background Media

- Update `public/assets/images/backgrounds/backgrounds.json` to control which media files are considered for rotation.
- Each entry can be either a simple string (image-only background) or an object with `image` and `video` keys pointing to files in `public/assets/images/backgrounds/` and `public/assets/videos/backgrounds/`, respectively.
- Videos fade in after their paired still image is shown, so initial page load stays responsive while motion assets buffer in the background.
- Assets are selected at random on page load, avoiding repeats between sessions when possible thanks to localStorage caching.

## Customization Tips

- Edit page content and layouts in `src/pages/`.
- Create or modify reusable UI elements in `src/components/`.
- Styling is handled via Tailwind CSS and CSS modules in `src/styles/`.
- Configure routes and navigation in `src/router.jsx`.

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
- [Production](https://priyanshusah.com) - Vercel
- [Dev](https://dev.priyanshusah.com/) - Vercel
## Credits

- Inspiration: [James Oliver Portfolio](https://james-oliver-portfolio.netlify.app/)
- Backgrounds: Video backgrounds sourced from the Steam Wallpaper Engine Workshop — credit to the original artists.
- Music: credits to the original artists.

## Roadmap

### Issue
* [ ] Need to improve card hover animaiton for portfolio card , this is not it , also make it untrigger when you hover over light bulb
* [ ] Content margin Cut off , way to different for desktop vs mobile , too much gap in mobile
* [ ] Boxing still present in mobile need to check glow / svg interaction
* [ ] Music Player Mobile UI , initial letters cut off
* [ ] Hide theme controls + Music player while Scrolling down when the journey Scroll indicator Disappears [img](https://github.com/user-attachments/assets/e61b475a-aac9-493d-ae6d-865456506dea)
* [ ] Add Typing effect same as Home page with same cursor and type effect to blog section Description [img](https://github.com/user-attachments/assets/fd813370-3d21-4c70-bc76-74f0a7b77726)
* [ ] **Need to Discuss** Change the call to action Button at end of journey to use new "/mail" route instead of mail:to route on Desktop ( use mailto as default option in Mobile , but in desktop use "/mail" )
* [ ] **Need to Discuss** in "/mail" On desktop don't trigger "mailto:" on Click button instead open new tab with gmail mail link , and then show the backup option with Copy and "mailto:" option (Essentially This means on Desktop "mailto:" and "gmail mail link" are swapped , no changes in Mobile UI
* [ ] Remove old Analytics Script That were saved locally/ added to Pure Html , Will switch to vercel React version After prod Deployment
* [ ] Click outside to Exit Expanded portfolio card , [img](https://github.com/user-attachments/assets/6fb89c48-5aff-4c0e-a020-395a9216138f)
* [ ] Remove Arrow From "/mail" Button , Change Hover Animation use either 19 from this [link](https://tympanus.net/Development/ButtonHoverStyles/)
* [ ] Prepare Blogs to use JSON as data source and prepare Ui for it . Rough Example : [json Structure](https://github.com/KartikBankar21/xoTEMPESTox.github.io/blob/80ab17039829bcf3aad2f253ed2ca6044a1a373c/public/data/blogs_v2.json) , Need some refinement but use this to gague rough feilds that will be present 
