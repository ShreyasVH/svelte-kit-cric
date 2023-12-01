import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};
	return {
		plugins: [sveltekit()],
		server: {
			host: process.env.VITE_HOST,
			port: process.env.VITE_PORT
		}
	}
})
