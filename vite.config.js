
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: 'inline', 
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.jsx'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});


