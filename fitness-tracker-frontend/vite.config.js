import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    autoprefixer()
  ],
  server : {
    https: {
      // __dirname is defined as the current directory, effectively.
      // Flags in eslint are disabled to avoid false positives.
      // eslint-disable-next-line no-undef
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      // eslint-disable-next-line no-undef
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem'))
    }
  }
})
