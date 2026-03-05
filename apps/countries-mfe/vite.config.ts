import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'countriesMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './CountriesFeature': './src/features/countries/index.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  resolve: {
    alias: { 
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../../shared')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
})
