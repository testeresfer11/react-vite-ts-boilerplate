import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:6666',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
