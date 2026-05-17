// Data Formatter
// Transforms raw scraped LinkedIn data into blog_data.json format

import slugify from 'slugify';
import config from './config.js';

/**
 * Formats raw scraped posts into blog_data.json structure
 * @param {Array} rawPosts - Array of raw post data from scraper
 * @returns {Array} Formatted posts matching blog_data.json schema
 */
export function formatPosts(rawPosts) {
    return rawPosts
        .filter(post => post.text && post.text.length > 0)
        .map((post, index) => formatSinglePost(post, index));
}

/**
 * Formats a single post
 */
function formatSinglePost(post, index) {
    const rawText = post.text || '';

    // Clean LinkedIn-specific text formatting
    const text = cleanLinkedInText(rawText);

    // Use hashtags from scraper (already extracted from DOM)
    const hashtags = post.hashtags || extractHashtags(text);

    // Generate title from first line
    const title = generateTitle(text);

    // Generate slug
    const slug = slugify(title, { lower: true, strict: true });

    // Generate ID from URN or fallback
    const id = post.urn || `urn:li:share:${Date.now()}-${index}`;

    // Remove hashtag section from clean text for content
    const contentText = removeHashtagBlock(text);

    return {
        id,
        title,
        slug,
        date: post.date || new Date().toISOString(),
        author: {
            name: config.author.name,
            avatar: post.avatar || '',
            profileUrl: config.author.profileUrl
        },
        metrics: {
            likes: post.likes || 0,
            comments: post.comments || 0,
            views: post.views || 0,
            shares: post.shares || 0
        },
        tags: hashtags,
        content: {
            raw: contentText,
            markdown: textToMarkdown(contentText),
            summary: generateSummary(contentText)
        },
        media: formatMedia(post.media || []),
        originalUrl: post.originalUrl || ''
    };
}

/**
 * Cleans LinkedIn-specific text formatting
 */
function cleanLinkedInText(text) {
    // Convert 'hashtag\n#xyz' and 'hashtag#xyz' → '#xyz'
    let cleaned = text.replace(/hashtag\s*\n?\s*#(\w+)/gi, '#$1');

    // Remove trailing '…more' and whitespace
    cleaned = cleaned.replace(/[\s\n]*…more\s*$/i, '');

    // Clean up excessive whitespace/newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

    return cleaned.trim();
}

/**
 * Removes trailing hashtag block from text
 */
function removeHashtagBlock(text) {
    // Remove lines that are just hashtags at the end
    return text.replace(/(\s*#\w+\s*)+$/g, '').trim();
}

/**
 * Extracts hashtags from text (fallback if not from DOM)
 */
function extractHashtags(text) {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];

    return matches
        .map(tag => tag.replace('#', '').toLowerCase())
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .slice(0, 10);
}

/**
 * Generates a title from post text
 */
function generateTitle(text) {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return 'Untitled Post';

    let title = lines[0].trim();

    // Remove hashtags from title
    title = title.replace(/#\w+/g, '').trim();

    // Truncate if too long
    if (title.length > 80) {
        title = title.substring(0, 77) + '...';
    }

    return title || 'Untitled Post';
}

/**
 * Converts plain text to basic markdown
 */
function textToMarkdown(text) {
    let markdown = text;

    // Convert URLs to markdown links
    markdown = markdown.replace(
        /(https?:\/\/[^\s]+)/g,
        '[$1]($1)'
    );

    // Convert bullet-like patterns to markdown lists
    markdown = markdown.replace(/^[•🔹]\\s*/gm, '- ');

    return markdown;
}

/**
 * Generates a summary from text
 */
function generateSummary(text) {
    let summary = text
        .replace(/#\w+/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (summary.length > 150) {
        summary = summary.substring(0, 147) + '...';
    }

    return summary;
}

/**
 * Formats media array
 */
function formatMedia(media) {
    return media
        .filter(m => m.url && m.url.length > 0)
        .map((m, index) => ({
            type: m.type || 'image',
            url: m.url,
            alt: m.alt || `Media ${index + 1}`,
            width: m.width || 800,
            height: m.height || 800
        }));
}

export { extractHashtags, generateTitle, generateSummary };
