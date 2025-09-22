import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single config: build to ../docs for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/mySpotifyWrapped/',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
  },
})
