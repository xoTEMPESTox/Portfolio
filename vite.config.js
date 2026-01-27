import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { cp } from "fs/promises";
import tailwindcss from '@tailwindcss/vite'

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const copyRedirects = () => ({
    name: "copy-redirects",
    async closeBundle() {
        const sourceDir = resolve(__dirname, "src/redirects");
        const destDir = resolve(__dirname, "dist");
        await cp(sourceDir, destDir, { recursive: true });
    },
});

export default defineConfig({
    base: "/",
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
    plugins: [copyRedirects(),tailwindcss(),],
});
