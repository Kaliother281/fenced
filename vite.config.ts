import { defineConfig } from "vite";

// Custom domain (fenced.dev) serves from root, so base stays "/".
// Shiki is large; let it split into its own chunk for caching.
export default defineConfig({
  base: "/",
  build: {
    target: "es2022",
  },
});
