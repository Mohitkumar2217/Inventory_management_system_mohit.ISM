import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': {
        // target: 'https://inventory-management-system-mohit-ism.onrender.com',
        target: 'https://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})