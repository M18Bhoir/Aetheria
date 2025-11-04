import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Keep the frontend dev server port
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Set to false if backend is http
        // Optional: rewrite path if backend expects routes without /api
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    // Output directory relative to the project root
    // This 'dist' folder will be served by the Express backend
    outDir: 'dist',
  },
   // Add resolve alias for easier imports if desired
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
})