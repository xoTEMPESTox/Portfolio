import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import slugify from 'slugify';
import config from './config.js';
import { scrapePosts } from './scraper.js';
import { processPostWithLLM, isGeminiAvailable, switchToNextModel } from './llm.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_POSTS_PATH = resolve(__dirname, 'raw_posts.json');

// Define media directories
const MEDIA_ROOT = resolve(__dirname, '../../public/data/media');
const POSTS_MEDIA_DIR = join(MEDIA_ROOT, 'posts');
const AVATAR_MEDIA_DIR = join(MEDIA_ROOT, 'avatars');

// Ensure directories exist
if (!existsSync(POSTS_MEDIA_DIR)) mkdirSync(POSTS_MEDIA_DIR, { recursive: true });
if (!existsSync(AVATAR_MEDIA_DIR)) mkdirSync(AVATAR_MEDIA_DIR, { recursive: true });

// Parse CLI mode
const args = process.argv.slice(2);
const MODE = args.includes('--process-only') ? 'process'
    : args.includes('--scrape-only') ? 'scrape'
        : 'all';
const REPROCESS_ALL = args.includes('--reprocess-all');

function log(msg) {
    if (config.debug) console.log(`[Scraper] ${msg}`);
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║           LinkedIn Posts Scraper v2.0                     ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    if (MODE === 'scrape' || MODE === 'all') {
        await phaseScrape();
    }

    if (MODE === 'process' || MODE === 'all') {
        await phaseProcess();
    }
}

// ═══════════════════════════════════════════════
// PHASE 1: Scrape raw data from LinkedIn
// ═══════════════════════════════════════════════
async function phaseScrape() {
    console.log('\n⚠️  Make sure Chrome is CLOSED before running this script!\n');
    console.log('\n── Phase 1: Scraping LinkedIn ──────────────────────────────\n');

    let context;
    try {
        log('Launching Playwright Chromium with ScraperProfile...');
        context = await chromium.launchPersistentContext(config.chromeProfilePath, {
            headless: false,
            viewport: null,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            args: ['--disable-extensions']
        });

        const page = await context.newPage();

        log('Browser launched successfully');

        // Check login
        await page.goto('https://in.linkedin.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await delay(5000);

        const currentUrl = page.url();
        log(`Current URL: ${currentUrl}`);

        const isLoggedIn = !currentUrl.includes('/login') && !currentUrl.includes('/authwall');
        if (!isLoggedIn) {
            console.error('\n❌ Not logged into LinkedIn!');
            console.error('Run "npm run login" first to log in, then run scrape again.');
            await context.close();
            process.exit(1);
        }
        log('Logged into LinkedIn ✓');

        // Scrape raw posts
        const rawPosts = await scrapePosts(page);
        log(`Scraped ${rawPosts.length} raw posts`);

        // Close browser
        await context.close();
        context = null;
        log('Browser closed');

        // Save raw posts
        writeFileSync(RAW_POSTS_PATH, JSON.stringify(rawPosts, null, 2), 'utf8');
        log(`Saved ${rawPosts.length} raw posts to raw_posts.json`);

        console.log('\n╔═══════════════════════════════════════════════════════════╗');
        console.log(`║  ✅ Phase 1 complete: ${rawPosts.length} posts scraped`);
        console.log(`║  📁 Raw data: raw_posts.json`);
        if (MODE === 'scrape') {
            console.log(`║  💡 Run "npm run process" to process through Gemini LLM`);
        }
        console.log('╚═══════════════════════════════════════════════════════════╝');

    } catch (error) {
        console.error('\n❌ Scrape error:', error.message);
        if (error.message.includes('Failed to launch')) {
            console.error('\n💡 Tips:');
            console.error('   1. Make sure Chrome is completely closed');
            console.error('   2. Try running as administrator');
        }
        throw error;
    } finally {
        if (context) await context.close();
    }
}

// ═══════════════════════════════════════════════
// PHASE 2: Process raw_posts.json → blog_data.json
// ═══════════════════════════════════════════════
async function phaseProcess() {
    console.log('\n── Phase 2: Processing & Merging ───────────────────────────\n');

    // Load raw posts
    if (!existsSync(RAW_POSTS_PATH)) {
        console.error('❌ raw_posts.json not found! Run "npm run scrape" first.');
        process.exit(1);
    }

    const rawPosts = JSON.parse(readFileSync(RAW_POSTS_PATH, 'utf8'));
    log(`Loaded ${rawPosts.length} raw posts from raw_posts.json`);

    // Load existing posts
    let existingPosts = [];
    if (existsSync(config.outputPath)) {
        try {
            existingPosts = JSON.parse(readFileSync(config.outputPath, 'utf8'));
            log(`Loaded ${existingPosts.length} existing posts from blog_data.json`);
        } catch (e) {
            console.error('⚠️ Could not parse existing blog_data.json, starting fresh');
        }
    }

    // Build map of existing posts for quick lookup
    const existingById = new Map();
    const existingTagSet = new Set();
    for (const post of existingPosts) {
        existingById.set(post.id, post);
        if (post.tags) post.tags.forEach(t => existingTagSet.add(t));
    }
    const existingTags = [...existingTagSet].sort();
    log(`Existing tag vocabulary: ${existingTags.length} unique tags`);

    // Identify new vs existing posts
    const newPosts = [];
    const existingToUpdate = [];

    for (const raw of rawPosts) {
        const postId = raw.urn || `urn:li:share:${Date.now()}-${rawPosts.indexOf(raw)}`;
        if (existingById.has(postId)) {
            const existing = existingById.get(postId);
            if (!REPROCESS_ALL && existing.content?.markdown && existing.title !== 'Untitled Post') {
                existingToUpdate.push({ raw, postId });
            } else {
                newPosts.push({ raw, postId });
            }
        } else {
            newPosts.push({ raw, postId });
        }
    }

    log(`New posts (to process): ${newPosts.length}, Existing (metrics update only): ${existingToUpdate.length}`);

    // Check if Gemini is available for new posts
    const geminiAvailable = newPosts.length > 0 ? await isGeminiAvailable() : false;

    if (newPosts.length > 0 && !geminiAvailable) {
        log('⚠️  Gemini not available - new posts will use basic formatting');
    }

    // Process NEW posts (LLM or basic formatting)
    const processedNew = [];
    for (let i = 0; i < newPosts.length; i++) {
        const { raw, postId } = newPosts[i];
        log(`Processing new post ${i + 1}/${newPosts.length}: "${raw.text?.substring(0, 50)}..."`);

        let content;
        let tags;

        if (geminiAvailable) {
            log('  → Running through Gemini LLM...');
            try {
                const llmResult = await processPostWithLLM(raw, existingTags);
                if (llmResult) {
                    content = {
                        raw: raw.text,
                        markdown: llmResult.markdown,
                        summary: llmResult.summary
                    };
                    tags = llmResult.tags;

                    const formatted = await buildPost(postId, llmResult.title, content, tags, raw);
                    processedNew.push(formatted);
                    log(`  ✓ LLM processed: "${llmResult.title}"`);

                    // Incremental save to preserve progress
                    saveIncrementally(existingPosts, processedNew, existingToUpdate, existingById);

                    // Rate limiting: 15s delay (4 requests per minute)
                    if (i < newPosts.length - 1) {
                        log('  (Rate limiting: waiting 15s before next LLM call...)');
                        await delay(15000);
                    }
                    continue;
                }
            } catch (err) {
                const errMsg = err.message?.toLowerCase() || '';
                if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit')) {
                    log('  ⚠️ Gemini rate limit reached or quota exhausted.');
                    const switched = await switchToNextModel();
                    if (switched) {
                        log('  ↻ Switched model, retrying current post...');
                        i--; // Retry this post
                        await delay(2000); // Short buffer before retry
                        continue;
                    } else {
                        log('  ❌ No more fallback models. Switching to basic formatting for remaining posts.');
                    }
                } else {
                    log(`  ❌ Gemini error: ${err.message}`);
                    log('  → Falling back to basic formatting for this post.');
                }
            }
        }

        // Fallback: basic formatting
        const cleaned = cleanText(raw.text);
        const title = generateBasicTitle(cleaned);
        content = {
            raw: raw.text,
            markdown: cleaned,
            summary: cleaned.substring(0, 147) + '...'
        };
        tags = raw.hashtags || [];

        processedNew.push(await buildPost(postId, title, content, tags, raw));
        log(`  ✓ Basic format: "${title}"`);
    }

    // Update EXISTING posts (metrics only)
    for (const { raw, postId } of existingToUpdate) {
        const existing = existingById.get(postId);
        existing.metrics = {
            likes: raw.likes || existing.metrics.likes,
            comments: raw.comments || existing.metrics.comments,
            views: raw.views || existing.metrics.views,
            shares: raw.shares || existing.metrics.shares
        };
        if (raw.media && raw.media.length > 0) {
            const updatedMedia = [];
            for (let idx = 0; idx < raw.media.length; idx++) {
                const m = raw.media[idx];
                let localUrl = '';
                let localVideoUrl = '';
                if (m.url) {
                    localUrl = await downloadMedia(m.url, postId, idx);
                }
                if (m.videoUrl) {
                    localVideoUrl = await downloadMedia(m.videoUrl, postId, `${idx}_vid`);
                }
                updatedMedia.push({
                    type: m.type || 'image',
                    url: localUrl || m.url,
                    videoUrl: localVideoUrl || m.videoUrl,
                    alt: m.alt || `Image ${idx + 1}`,
                    width: m.width || 800,
                    height: m.height || 800
                });
            }
            existing.media = updatedMedia;
        }
        if (raw.avatar) {
            existing.author.avatar = await downloadAvatar(raw.avatar, 'author_avatar');
        }
        log(`  ↻ Updated metrics & media for: "${existing.title}"`);
    }

    // Merge: existing (updated) + new
    const allPosts = [...existingPosts, ...processedNew];

    // Deduplicate by ID
    const deduped = new Map();
    for (const post of allPosts) {
        deduped.set(post.id, post);
    }

    // Sort by date (newest first)
    const finalPosts = Array.from(deduped.values())
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save
    writeFileSync(config.outputPath, JSON.stringify(finalPosts, null, 4), 'utf8');

    // Generate SEO files (sitemap.xml and fully rendered static OpenGraph preview pages)
    generateSEOFiles(finalPosts);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log(`║  ✅ Successfully saved ${finalPosts.length} posts!`);
    console.log(`║  📁 Output: ${config.outputPath}`);
    console.log(`║  🆕 New: ${processedNew.length} | ↻ Updated: ${existingToUpdate.length}`);
    if (geminiAvailable && processedNew.length > 0) {
        console.log(`║  🤖 Gemini LLM processed: ${processedNew.length} posts`);
    }
    console.log('╚═══════════════════════════════════════════════════════════╝');
}

function saveIncrementally(existingPosts, processedNew, existingToUpdate, existingById) {
    const currentProcessedIds = new Set(processedNew.map(p => p.id));
    const updatedMap = new Map();
    existingToUpdate.forEach(({ postId }) => {
        updatedMap.set(postId, existingById.get(postId));
    });

    const finalPosts = [
        ...existingPosts.map(p => updatedMap.has(p.id) ? updatedMap.get(p.id) : p)
            .filter(p => !currentProcessedIds.has(p.id)),
        ...processedNew
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    writeFileSync(config.outputPath, JSON.stringify(finalPosts, null, 4), 'utf8');
}

async function buildPost(id, title, content, tags, raw) {
    const slug = slugify(title, { lower: true, strict: true });
    const avatarUrl = raw.avatar ? await downloadAvatar(raw.avatar, 'author_avatar') : '';

    const mediaItems = [];
    if (raw.media && raw.media.length > 0) {
        for (let idx = 0; idx < raw.media.length; idx++) {
            const m = raw.media[idx];
            let localUrl = '';
            let localVideoUrl = '';
            if (m.url) {
                localUrl = await downloadMedia(m.url, id, idx);
            }
            if (m.videoUrl) {
                localVideoUrl = await downloadMedia(m.videoUrl, id, `${idx}_vid`);
            }
            mediaItems.push({
                type: m.type || 'image',
                url: localUrl || m.url,
                videoUrl: localVideoUrl || m.videoUrl,
                alt: m.alt || `Image ${idx + 1}`,
                width: m.width || 800,
                height: m.height || 800
            });
        }
    }

    return {
        id,
        title,
        slug,
        date: raw.date || new Date().toISOString(),
        author: {
            name: config.author.name,
            avatar: avatarUrl,
            profileUrl: config.author.profileUrl
        },
        metrics: {
            likes: raw.likes || 0,
            comments: raw.comments || 0,
            views: raw.views || 0,
            shares: raw.shares || 0
        },
        tags,
        content,
        media: mediaItems,
        originalUrl: raw.originalUrl || ''
    };
}

async function downloadMedia(url, postId, index) {
    if (!url) return '';
    if (url.startsWith('/data/media/')) return url;
    if (url.startsWith('/media/')) return url.replace('/media/', '/data/media/');

    try {
        const cleanId = postId.replace(/[^a-zA-Z0-9]/g, '_');
        const baseFilename = `${cleanId}_${index}`;

        const possibleExts = ['.jpg', '.png', '.gif', '.webp', '.mp4', '.webm'];
        for (const ext of possibleExts) {
            if (existsSync(join(POSTS_MEDIA_DIR, baseFilename + ext))) {
                return `/data/media/posts/${baseFilename}${ext}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            log(`⚠️ Failed to fetch media ${url.substring(0, 40)}... (Status: ${response.status})`);
            return url;
        }

        const contentType = response.headers.get('content-type') || '';
        let ext = '.jpg';
        if (contentType.includes('image/gif')) ext = '.gif';
        else if (contentType.includes('image/png')) ext = '.png';
        else if (contentType.includes('image/webp')) ext = '.webp';
        else if (contentType.includes('video/mp4')) ext = '.mp4';
        else if (contentType.includes('video/webm')) ext = '.webm';

        const filename = `${baseFilename}${ext}`;
        const filePath = join(POSTS_MEDIA_DIR, filename);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(filePath, buffer);

        log(`  ↓ Downloaded media: /data/media/posts/${filename}`);
        return `/data/media/posts/${filename}`;
    } catch (err) {
        log(`⚠️ Error downloading media ${url.substring(0, 40)}...: ${err.message}`);
        return url;
    }
}

async function downloadAvatar(url, username) {
    if (!url) return '';
    if (url.startsWith('/data/media/')) return url;
    if (url.startsWith('/media/')) return url.replace('/media/', '/data/media/');

    try {
        const possibleExts = ['.jpg', '.png', '.gif', '.webp'];
        for (const ext of possibleExts) {
            if (existsSync(join(AVATAR_MEDIA_DIR, username + ext))) {
                return `/data/media/avatars/${username}${ext}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) return url;

        const contentType = response.headers.get('content-type') || '';
        let ext = '.jpg';
        if (contentType.includes('image/gif')) ext = '.gif';
        else if (contentType.includes('image/png')) ext = '.png';
        else if (contentType.includes('image/webp')) ext = '.webp';

        const filename = `${username}${ext}`;
        const filePath = join(AVATAR_MEDIA_DIR, filename);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(filePath, buffer);

        log(`  ↓ Downloaded avatar: /data/media/avatars/${filename}`);
        return `/data/media/avatars/${filename}`;
    } catch (err) {
        return url;
    }
}

function cleanText(text) {
    return text
        .replace(/hashtag\s*\n?\s*#(\w+)/gi, '#$1')
        .replace(/[\s\n]*…more\s*$/i, '')
        .replace(/(\s*#\w+\s*)+$/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
}

function generateBasicTitle(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (!lines.length) return 'Untitled Post';
    let title = lines[0].replace(/#\w+/g, '').trim();
    if (title.length > 80) title = title.substring(0, 77) + '...';
    return title || 'Untitled Post';
}

/**
 * Generates sitemap.xml and fully rendered static OpenGraph preview pages for SEO and social sharing
 */
function generateSEOFiles(posts) {
    log('Generating SEO sitemap and fully rendered static OpenGraph preview pages...');

    // 1. Update sitemap.xml
    const sitemapPath = resolve(__dirname, '../../public/sitemap.xml');
    const staticRoutes = [
        { url: 'https://priyanshusah.com/', priority: '1.0' },
        { url: 'https://priyanshusah.com/about', priority: '0.8' },
        { url: 'https://priyanshusah.com/home', priority: '0.7' },
        { url: 'https://priyanshusah.com/journey', priority: '0.7' },
        { url: 'https://priyanshusah.com/skills', priority: '0.7' },
        { url: 'https://priyanshusah.com/socials', priority: '0.8' },
        { url: 'https://priyanshusah.com/mail', priority: '0.3' },
        { url: 'https://priyanshusah.com/linkedin', priority: '0.3' },
        { url: 'https://priyanshusah.com/github', priority: '0.2' },
        { url: 'https://priyanshusah.com/codolio', priority: '0.2' },
        { url: 'https://priyanshusah.com/leetcode', priority: '0.2' },
        { url: 'https://priyanshusah.com/portfolio', priority: '0.2' },
        { url: 'https://priyanshusah.com/resume', priority: '0.2' },
        { url: 'https://priyanshusah.com/resume-ai', priority: '0.2' },
        { url: 'https://priyanshusah.com/resume-global', priority: '0.2' },
        { url: 'https://priyanshusah.com/resume-fullstack', priority: '0.2' },
        { url: 'https://priyanshusah.com/twitch', priority: '0.1' },
        { url: 'https://priyanshusah.com/spotify', priority: '0.1' },
        { url: 'https://priyanshusah.com/steam', priority: '0.1' },
        { url: 'https://priyanshusah.com/discord', priority: '0.1' }
    ];

    let newSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const r of staticRoutes) {
        newSitemap += `  <url>\n    <loc>${r.url}</loc>\n    <priority>${r.priority}</priority>\n  </url>\n`;
    }

    for (const p of posts) {
        if (!p.slug) continue;
        const postDate = p.date ? p.date.substring(0, 10) : new Date().toISOString().substring(0, 10);
        newSitemap += `  <url>\n    <loc>https://priyanshusah.com/socials/${p.slug}</loc>\n    <lastmod>${postDate}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    }
    newSitemap += `</urlset>`;
    writeFileSync(sitemapPath, newSitemap, 'utf8');
    log(`  ✓ sitemap.xml updated with ${posts.length} blog posts`);

    // 2. Generate fully rendered static OpenGraph preview pages
    const socialsDir = resolve(__dirname, '../../public/socials');
    if (!existsSync(socialsDir)) mkdirSync(socialsDir, { recursive: true });

    for (const p of posts) {
        if (!p.slug) continue;
        const postDir = join(socialsDir, p.slug);
        if (!existsSync(postDir)) mkdirSync(postDir, { recursive: true });

        const title = p.title ? p.title.replace(/"/g, '&quot;') : 'Blog Post';
        const desc = p.content?.summary ? p.content.summary.replace(/"/g, '&quot;') : 'Check out my latest post on priyanshusah.com';
        const image = p.media && p.media.length > 0 ? `https://priyanshusah.com${p.media[0].url}` : 'https://priyanshusah.com/assets/images/og-default.jpg';
        const url = `https://priyanshusah.com/socials/${p.slug}`;

        let cleanHtmlBody = (p.content?.markdown || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .split('\n\n')
            .map(para => {
                if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) return para;
                if (para.includes('\n- ') || para.startsWith('- ')) {
                    const items = para.split('\n').filter(l => l.trim().startsWith('- ')).map(l => `<li>${l.replace(/^- /, '').trim()}</li>`).join('');
                    return `<ul>${items}</ul>`;
                }
                return `<p>${para.replace(/\n/g, '<br>')}</p>`;
            })
            .join('\n');

        const schemaJson = {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": title,
            "description": desc,
            "image": image,
            "author": {
                "@type": "Person",
                "name": p.author?.name || "Priyanshu Sah",
                "url": p.author?.profileUrl || "https://priyanshusah.com"
            },
            "datePublished": p.date || new Date().toISOString(),
            "dateModified": p.date || new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            }
        };

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Priyanshu Sah</title>
    <meta name="description" content="${desc}">
    
    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${image}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${desc}">
    <meta property="twitter:image" content="${image}">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    ${JSON.stringify(schemaJson, null, 2)}
    </script>

    <!-- Styles matching portfolio aesthetics -->
    <style>
        :root {
            --bg-color: #09090b;
            --card-bg: #18181b;
            --text-main: #f4f4f5;
            --text-muted: #a1a1aa;
            --accent: #3b82f6;
            --border: #27272a;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
        }
        .nav-header {
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(9, 9, 11, 0.8);
            backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .nav-logo {
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--text-main);
            text-decoration: none;
        }
        .nav-back {
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s;
        }
        .nav-back:hover {
            color: var(--text-main);
        }
        .container {
            max-width: 800px;
            margin: 3rem auto;
            padding: 0 1.5rem;
        }
        article {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 1.5rem;
            padding: 2.5rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .meta-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }
        .author-img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
        }
        .author-info {
            display: flex;
            flex-direction: column;
        }
        .author-name {
            font-weight: 600;
        }
        .post-date {
            font-size: 0.85rem;
            color: var(--text-muted);
        }
        h1 {
            font-size: 2rem;
            line-height: 1.3;
            margin-top: 0;
            margin-bottom: 1.5rem;
        }
        h2, h3 {
            margin-top: 2rem;
            color: var(--text-main);
        }
        p {
            margin-bottom: 1.5rem;
            color: #d4d4d8;
        }
        .media-container {
            margin: 2rem 0;
            border-radius: 1rem;
            overflow: hidden;
            border: 1px solid var(--border);
        }
        .media-container img, .media-container video {
            width: 100%;
            height: auto;
            display: block;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
        }
        .tag {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            color: var(--text-muted);
        }
        .app-prompt {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            border-top: 1px solid var(--border);
        }
        .btn-interactive {
            display: inline-block;
            background-color: var(--accent);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            text-decoration: none;
            font-weight: 600;
            margin-top: 1rem;
            transition: opacity 0.2s;
        }
        .btn-interactive:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <header class="nav-header">
        <a href="/" class="nav-logo">Priyanshu Sah</a>
        <a href="/socials" class="nav-back">← All Posts</a>
    </header>
    <main class="container">
        <article>
            <div class="meta-bar">
                <img src="${p.author?.avatar || '/data/media/avatars/author_avatar.jpg'}" alt="${p.author?.name}" class="author-img">
                <div class="author-info">
                    <span class="author-name">${p.author?.name || 'Priyanshu Sah'}</span>
                    <span class="post-date">${new Date(p.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            <h1>${title}</h1>
            ${p.media && p.media.length > 0 ? `
            <div class="media-container">
                ${p.media[0].type === 'video' && p.media[0].videoUrl ? `
                <video controls poster="${p.media[0].url}"><source src="${p.media[0].videoUrl}" type="video/mp4"></video>
                ` : `
                <img src="${p.media[0].url}" alt="${title}">
                `}
            </div>
            ` : ''}
            <div class="content-body">
                ${cleanHtmlBody}
            </div>
            <div class="tags">
                ${(p.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
            </div>
        </article>
        <div class="app-prompt">
            <h3>Want to explore my full interactive portfolio?</h3>
            <p>Experience 3D environments, cinematic looping backgrounds, and my complete engineering journey.</p>
            <a href="/socials?post=${p.slug}" class="btn-interactive">Launch Interactive App 🚀</a>
        </div>
    </main>
</body>
</html>`;
        writeFileSync(join(postDir, 'index.html'), html, 'utf8');
    }
    log(`  ✓ Generated ${posts.length} fully rendered static OpenGraph preview pages in public/socials/`);
}

// Run
main().catch(console.error);
