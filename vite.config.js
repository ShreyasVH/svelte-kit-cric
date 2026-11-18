import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};
	return {
		plugins: [
			sveltekit({
				// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
				// If your environment is not supported or you settled on a specific environment, switch out the adapter.
				// See https://kit.svelte.dev/docs/adapters for more information about adapters.
				adapter: adapter()
			})
		],
		server: {
			host: process.env.VITE_HOST,
			port: process.env.VITE_PORT,
			allowedHosts: [process.env.VITE_ALLOWED_HOSTS]
		}
	}
})
