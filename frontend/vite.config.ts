import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Cleaner way to define the @ alias
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Keep this if you are using custom assets
  assetsInclude: ['**/*.svg', '**/*.csv'],
})