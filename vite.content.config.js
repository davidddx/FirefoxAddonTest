import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // ADD THIS SECTION:
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env': '{}', // Provides a fallback for other process.env calls
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/content.jsx'),
      formats: ['iife'],
      name: 'content',
      fileName: () => 'content.js',
    },
  },
});
