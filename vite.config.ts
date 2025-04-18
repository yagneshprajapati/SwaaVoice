import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SwaaVoice/',  // Updated to match GitHub repo name
  server: {
    port: 3000
  }
})
