// Gemini LLM Integration
// Transforms raw LinkedIn post text into clean blog-style content
// Only runs ONCE per new post

import { readFileSync } from 'fs';

let genAI = null;
let model = null;

let availableModels = [];
let currentModelIndex = 0;
let apiKey = null;

/**
 * Initializes the Gemini client
 * @param {boolean} force - Whether to force re-initialization (e.g. for model switch)
 */
async function initGemini(force = false) {
    if (model && !force) return;

    // Load .env manually (no dotenv dependency needed)
    try {
        const envContent = readFileSync(new URL('./.env', import.meta.url), 'utf8');
        const envVars = {};
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
                envVars[trimmed.substring(0, eqIdx).trim()] = trimmed.substring(eqIdx + 1).trim();
            }
        }

        apiKey = envVars.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const primaryModel = envVars.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
        const altModel = envVars.GEMINI_MODEL_ALT || process.env.GEMINI_MODEL_ALT;

        availableModels = [primaryModel];
        if (altModel) availableModels.push(altModel);

        if (!apiKey || apiKey === 'your_api_key_here') {
            throw new Error('GEMINI_API_KEY not set in .env file');
        }

        const modelName = availableModels[currentModelIndex];
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: modelName });

        console.log(`[LLM] Initialized Gemini (${modelName})`);
    } catch (err) {
        console.error('[LLM] Failed to initialize Gemini:', err.message);
        throw err;
    }
}

/**
 * Switches to the next available Gemini model if possible
 * @returns {boolean} True if switched to a new model, false if no more models
 */
export async function switchToNextModel() {
    if (currentModelIndex + 1 < availableModels.length) {
        currentModelIndex++;
        const nextModel = availableModels[currentModelIndex];
        console.log(`[LLM] Exhausted model. Switching to fallback: ${nextModel}`);
        await initGemini(true);
        return true;
    }
    console.warn('[LLM] No more fallback models available.');
    return false;
}


/**
 * Processes a single raw post through Gemini to generate blog content
 * @param {Object} rawPost - Raw scraped post data
 * @param {string[]} existingTags - Tags already used in the blog for consistency
 * @returns {Object} Processed content { title, summary, markdown, tags }
 */
export async function processPostWithLLM(rawPost, existingTags = []) {
    await initGemini();

    const existingTagsList = existingTags.length > 0
        ? `\nEXISTING BLOG TAGS (reuse these when they fit, for consistency):\n${existingTags.join(', ')}\n`
        : '';

    const prompt = `You are an expert technical editor and content formatter for a premium personal tech blog/portfolio. Transform this raw LinkedIn post into a highly polished, engaging, and structured blog article.

RAW POST TEXT:
"""
${rawPost.text}
"""

PREDEFINED PREMIUM TAG TAXONOMY:
["ai-ml", "system-design", "full-stack", "ui-ux", "career-growth", "research", "open-source", "internship", "cloud-devops", "creative-coding", "robotics", "architecture", "web-dev", "mobile-dev", "databases"]

INSTRUCTIONS:
1. Generate a concise, compelling blog TITLE (max 80 chars, professional, no hashtags, no emojis at start).
2. Generate a SUMMARY (1-2 sentences, max 150 chars, plain text, no emojis).
3. Convert the post to a polished, professional MARKDOWN blog article:
   - Remove LinkedIn fluff and cliché openings ("Excited to share...", "I am thrilled to announce...", "I'm happy to share...").
   - Structure the article with clear Markdown headings (###) where appropriate to break up thoughts.
   - Use bold text for key takeaways or emphasis.
   - Convert bullet points (•, 🔹) to proper clean markdown lists.
   - Clean up "hashtag#xyz" → remove entirely from body.
   - Remove trailing hashtag blocks entirely.
   - Ensure the tone is authoritative, insightful, and professional.
4. Select exactly 2 to 4 TAGS strictly from the PREDEFINED PREMIUM TAG TAXONOMY above:
   - Do NOT invent new tags outside the predefined list.
   - Choose the tags that best categorize the post for portfolio filtering.

RESPOND IN THIS EXACT JSON FORMAT (no markdown code fences):
{
  "title": "...",
  "summary": "...",
  "markdown": "...",
  "tags": ["tag1", "tag2"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse JSON from response (handle potential markdown code fences)
    let jsonStr = responseText;
    if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);

    // Enforce max 6 tags
    const tags = (parsed.tags || []).slice(0, 6).map(t => t.toLowerCase().trim());

    return {
        title: parsed.title || rawPost.text.substring(0, 77) + '...',
        summary: parsed.summary || rawPost.text.substring(0, 147) + '...',
        markdown: parsed.markdown || rawPost.text,
        tags
    };

}

/**
 * Checks if Gemini is available
 */
export async function isGeminiAvailable() {
    try {
        await initGemini();
        return true;
    } catch {
        return false;
    }
}
