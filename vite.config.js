import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import removeConsole from 'vite-plugin-remove-console'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    removeConsole() // eliminar los console.log
  ],
  build: {
    terserOptions: {
      format: {
        comments: false,  // Elimina comentarios
      },
      compress: {
        drop_console: true,  // Elimina console.log
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
