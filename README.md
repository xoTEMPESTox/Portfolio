# Portfolio

A Vite-powered personal portfolio showcasing key projects, services, and testimonials on a single-page experience. The site blends Bootstrap 5 styling with custom animations, dynamic background media, and Swiper.js carousels to create an interactive presentation.

- Single-page layout with quick navigation between `home`, `about`, `quality`, `skills`, `services`, `portfolio`, `reviews`, and `contact` sections.
- Background stills load instantly from `public/assets/images/backgrounds/backgrounds.json`, and matching videos fade in once buffered, with optional parallax for desktop visitors.
- Swiper.js sliders highlight portfolio work and client reviews, adapting automatically to varying screen widths.
- Staged background loader shows the paired still immediately and fades in the video once buffered, keeping the first paint fast.
- Bootstrap bundle is imported locally so data attributes (e.g. tooltips, dropdowns) work without additional setup.

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

## Deployment

1. Run `npm run build`.
2. Deploy the generated `dist/` folder to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).
3. Ensure `public/assets/` is copied alongside the build output so media and manifest files resolve correctly.

Feel free to adapt the content, color palette, or assets to tailor the portfolio for your own brand.
