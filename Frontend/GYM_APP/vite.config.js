import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    
    outDir: 'dist',
  },
  server: {
    // Para desarrollo
    historyApiFallback: true
  },
  preview: {
    // Para producción local
    historyApiFallback: true
  }
})