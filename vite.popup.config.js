import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	define: {
		'process.env.NODE_ENV': JSON.stringify('development'),
	},
	build: {
		outDir: 'dist',
		emptyOutDir: false, 
		minify: false,
		sourcemap: true,
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'popup/popup.html'),
			},
			output: {
				entryFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
		},
	},
});
