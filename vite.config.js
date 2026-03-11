import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'math': ['mathjs', 'decimal.js']
        }
      }
    }
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  
  // GitHub Pages 部署配置
  // 必须设置 base 为仓库名，否则资源路径会错误
  // 如果部署到根域名，改为 '/'
  // 如果部署到 Vercel，可以改为 '/'
  base: '/smart-calculator/'
})