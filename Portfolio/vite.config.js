import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
    // Keep dev server at root, but prefix assets when building for GitHub Pages.
    base: command === "serve" ? "/" : "/xoTEMPESTox/",
    build: {
        outDir: "dist",
    },
}));
