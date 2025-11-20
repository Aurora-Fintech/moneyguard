import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use root base in dev to avoid 404/500 on /moneyguard/ paths
  base: command === 'build' ? '/moneyguard/' : '/',
  server: {
    proxy: {
      // Proxy API in dev to bypass expired SSL at upstream
      '/api': {
        target: 'https://wallet.b.goit.study',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
