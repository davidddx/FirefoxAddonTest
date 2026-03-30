
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	build: {
		minify: false,
		outDir: 'dist',
		sourcemap: true, 
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


