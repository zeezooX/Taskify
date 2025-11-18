import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://localhost:7180',
				secure: false,
				changeOrigin: true
			}
		},
		port: 5173
	},
	build: {
		outDir: '../API/wwwroot',
		emptyOutDir: true
	}
});
