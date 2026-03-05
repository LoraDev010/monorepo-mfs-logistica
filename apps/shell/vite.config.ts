import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        usersMfe: `${process.env.VITE_USERS_MFE_URL ?? 'http://localhost:5174'}/assets/remoteEntry.js`,
        countriesMfe: `${process.env.VITE_COUNTRIES_MFE_URL ?? 'http://localhost:5175'}/assets/remoteEntry.js`,
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
})
