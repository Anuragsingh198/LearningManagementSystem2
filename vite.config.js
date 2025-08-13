import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.pdf'],
  build: {
    outDir: 'dist',
  },
  server: {
    hmr: {
      overlay: true,
    }
  }
})
