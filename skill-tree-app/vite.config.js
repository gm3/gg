import { defineConfig } from 'vite'

// Vite config for building the app into /docs at the repo root
// This makes it easy to host via GitHub Pages using the /docs folder.
export default defineConfig({
  build: {
    // Output to ../docs relative to the skill-tree-app folder
    // so the final path is <repo-root>/docs
    outDir: '../docs',
    emptyOutDir: true
  },
  // Use relative base so it works under GitHub Pages /docs
  base: './'
})

