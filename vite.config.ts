import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      root: 'src',
      base: './',
      server: {
        port: 5000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      },
      build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
          external: ['cordova.js']
        }
      }
    };
});
