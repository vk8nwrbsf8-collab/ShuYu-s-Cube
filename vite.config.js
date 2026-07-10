import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const cozePat = process.env.COZE_PAT || process.env.COZE_API_TOKEN || env.COZE_PAT || env.COZE_API_TOKEN
  const base = env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/ShuYu-s-Cube/')

  return {
    plugins: [react()],
    base,
    server: {
      proxy: {
        '/netease-api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/netease-api/, ''),
        },
        '/coze-api': {
          target: 'https://api.coze.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/coze-api/, ''),
          ...(cozePat
            ? { headers: { Authorization: `Bearer ${cozePat}` } }
            : {}),
        },
      },
    },
  }
})
