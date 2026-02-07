import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Needed for Docker to expose the port
    port: 5173,         // Ensure this matches your Dockerfile/Compose
    watch: {
      usePolling: true, // Fixes HMR issues on Windows/macOS Docker hosts
    },
  },
})