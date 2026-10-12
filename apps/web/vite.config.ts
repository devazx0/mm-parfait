import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: 'src',
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 9000,
  },
})
