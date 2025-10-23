import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // matches the folder your Express app serves
  },
})
