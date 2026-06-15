import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/library-task/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,

    rollupOptions: {
      input: resolve(__dirname, 'index.html'),

      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});