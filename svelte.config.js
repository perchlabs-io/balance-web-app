// import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-vercel';
 
// This function can run for a maximum of 5 seconds



/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			maxDuration: 60,
			memory: 1664,
		  }),
	},

	


}

export default config
