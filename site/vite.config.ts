import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Single config: build to ../docs for GitHub Pages
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-data-files',
      writeBundle() {
        // Copy data files to docs/data after build
        const dataDir = join(__dirname, '../docs/data')
        mkdirSync(dataDir, { recursive: true })
        copyFileSync('../data/all_music.csv', join(dataDir, 'all_music.csv'))
        copyFileSync('../data/clustered_sessions.csv', join(dataDir, 'clustered_sessions.csv'))
      }
    }
  ],
  base: '/mySpotifyWrapped/',
  build: {
    outDir: '../docs',
    emptyOutDir: false,
  },
})
