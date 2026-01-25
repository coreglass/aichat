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
    target: 'chrome105',
    minify: !process.env.TAURI_DEBUG,
    sourcemap: !!process.env.TAURI_DEBUG,
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle: async () => {
        const distDir = 'dist'
        
        // Copy CSS files
        await fs.copy(path.resolve('css'), path.resolve(distDir, 'css'))
        
        // Copy JS files
        await fs.copy(path.resolve('js'), path.resolve(distDir, 'js'))
        
        // Copy HTML files
        await fs.copy(path.resolve('index.html'), path.resolve(distDir, 'index.html'))
        await fs.copy(path.resolve('conversation.html'), path.resolve(distDir, 'conversation.html'))
        await fs.copy(path.resolve('model-settings.html'), path.resolve(distDir, 'model-settings.html'))
        await fs.copy(path.resolve('proxy.html'), path.resolve(distDir, 'proxy.html'))
        await fs.copy(path.resolve('about.html'), path.resolve(distDir, 'about.html'))
        
        // Copy assets directory
        await fs.copy(path.resolve('assets'), path.resolve(distDir, 'assets'))
        
        console.log('✓ Static files copied successfully')
      }
    }
  ]
})
