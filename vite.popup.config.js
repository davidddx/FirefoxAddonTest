/*
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
*/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    
    // dev server (take this out when im done) 
    server: {
        port: 5173, // You can change this to any port
        open: '/popup/popup.html', // Automatically opens this path in the browser
    },

    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },

    build: {
        outDir: 'dist',
        emptyOutDir: false, 
        minify: false,
        sourcemap: true,
        rollupOptions: {
            input: {
                // Keep this for your extension build
                popup: resolve(__dirname, 'popup/popup.html'),
            },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
});
