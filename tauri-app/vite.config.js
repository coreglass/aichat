import { defineConfig } from 'vite'
import fs from 'fs-extra'
import path from 'path'

export default defineConfig({
  clearScreen: false,
  base: './',
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    minify: !process.env.TAURI_DEBUG,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle: async () => {
        const distDir = 'dist'
        
        // Copy JS directory
        await fs.copy(path.resolve('js'), path.resolve(distDir, 'js'))
        
        // Copy HTML files
        await fs.copy(path.resolve('about.html'), path.resolve(distDir, 'about.html'))
        await fs.copy(path.resolve('proxy.html'), path.resolve(distDir, 'proxy.html'))
        await fs.copy(path.resolve('second.html'), path.resolve(distDir, 'second.html'))
        
        console.log('✓ Static files copied successfully')
      }
    }
  ]
})
