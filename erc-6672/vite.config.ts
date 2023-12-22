import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
	/*mode: "development",
	build: {
		minify: false
	},*/
	plugins: [
		svelte(),
		viteSingleFile({
			removeViteModuleLoader: true,
			useRecommendedBuildConfig: true,
		})
	],
});
