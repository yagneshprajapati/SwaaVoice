import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/YagVoice/',  // Add this line - must match your GitHub repo name
  server: {
    port: 3000
  }
})
