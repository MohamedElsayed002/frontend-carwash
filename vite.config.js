import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Environment variables
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://carwash-backend-production.up.railway.app/api'),
  },
  
  // تحسينات الأداء للهواتف
  build: {
    // تحسين حجم الملفات
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // تقسيم الملفات لتحسين التحميل
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons', 'lucide-react'],
          utils: ['axios'],
        },
      },
    },
    // تحسين حجم الصور
    assetsInlineLimit: 4096,
    // تحسين التسمية
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging
    sourcemap: false,
  },
  
  // تحسينات الخادم
  server: {
    host: true,
    port: 5173,
    // تحسين الأداء على الهواتف
    hmr: {
      overlay: false,
    },
    // تحسينات السرعة
    fs: {
      strict: false,
    },
    // تحسين التحميل
    watch: {
      usePolling: false,
      interval: 100,
    },
    // Proxy for development API calls
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://carwash-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // تحسينات التحميل
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
  
  // Environment configuration
  envPrefix: 'VITE_',
})
