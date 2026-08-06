import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true, // Expose dev server to local network (mobile devices)
  },
  build: {
    chunkSizeWarningLimit: 3000, // Suppress chunk size warnings (app uses Spline 3D which is large)
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'charts': ['recharts'],
          'icons': ['react-icons', 'lucide-react'],
        }
      }
    }
  }
})
