import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/public': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/public/, '/public')
      },
      '/api': {
        target: 'http://localhost:5000', // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // 保留 /api 前缀
      }
    }
  }
})