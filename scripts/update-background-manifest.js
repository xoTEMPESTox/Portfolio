#!/usr/bin/env node

/**
 * Utility script to regenerate the background manifest JSON file
 * from the files located in assets/images/backgrounds.
 */

const fs = require("fs");
const path = require("path");

const backgroundsDir = path.resolve(__dirname, "../assets/images/backgrounds");
const manifestPath = path.join(backgroundsDir, "backgrounds.json");
const allowedExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".mp4",
    ".webm",
    ".ogv",
    ".ogg",
]);

function collectBackgrounds() {
    const entries = fs.readdirSync(backgroundsDir, { withFileTypes: true });
    return entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => allowedExtensions.has(path.extname(name).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function writeManifest(files) {
    const contents = `${JSON.stringify(files, null, 4)}\n`;
    fs.writeFileSync(manifestPath, contents, "utf8");
}

try {
    const backgrounds = collectBackgrounds();
    writeManifest(backgrounds);
    console.log(`Updated ${path.relative(process.cwd(), manifestPath)} with ${backgrounds.length} item(s).`);
}
catch (error) {
    console.error("Failed to update background manifest:", error);
    process.exitCode = 1;
}
