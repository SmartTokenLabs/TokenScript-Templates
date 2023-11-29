import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'

const debug = {
	mode: "development",
	build: {
		minify: false
	},
}

export default defineConfig({
	...debug,
	plugins: [
		svelte(),
		viteSingleFile({
			removeViteModuleLoader: true,
			useRecommendedBuildConfig: true,
		})
	],
});
