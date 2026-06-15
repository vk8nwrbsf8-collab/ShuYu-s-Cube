import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ShuYu-s-Cube/',
  server: {
    proxy: {
      '/netease-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netease-api/, ''),
      },
      '/coze-api': {
        target: 'https://bhydrjmw8y.coze.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, ''),
      },
    },
  },
})
