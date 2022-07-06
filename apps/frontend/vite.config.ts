 /**
  * Change this to `true` to generate source maps alongside your production bundle. This is useful for debugging, but
  * will increase total bundle size and expose your source code.
  */
 const sourceMapsInProduction = true

 /*********************************************************************************************************************/
/**********                                              Vite                                               **********/
/*********************************************************************************************************************/

import { defineConfig, UserConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import autoprefixer from 'autoprefixer'
import pkg from './package.json'
import tsconfig from './tsconfig.json'

const production = process.env.NODE_ENV === 'production'
const config = <UserConfig> defineConfig({
	plugins: [
		svelte({
			emitCss: production,
			preprocess: sveltePreprocess({
				scss: {
					prependData: `
@import 'scss/mixins.scss';
@import 'scss/variables.scss';
`,
				},
			}),
			compilerOptions: {
				dev: !production,
			},
			experimental: {
				prebundleSvelteLibraries: true,
			},

			// @ts-ignore This is temporary until the type definitions are fixed!
			hot: !production,
		}),
	],
	build: {
		manifest: true,
		rollupOptions: {
			input: 'apps/home.ts',
		},
		sourcemap: sourceMapsInProduction,
	},
	clearScreen: false,
	css: {
		postcss: {
			plugins: [
				autoprefixer(),
			],
		},
	},
	server: {
		host: '0.0.0.0',
		port: 55505,
		hmr: {
			clientPort: 55505,
			port: 55505,
			protocol: 'ws',
		},
		watch: {
			usePolling: true, // Docker/WSL2 need this
		},
	},
})

// Load path aliases from the tsconfig.json file
const aliases = tsconfig.compilerOptions.paths

for (const alias in aliases) {
	const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p))

	// Our tsconfig uses glob path formats, whereas webpack just wants directories
	// We'll need to transform the glob format into a format acceptable to webpack

	const wpAlias = alias.replace(/(\\|\/)\*$/, '')
	const wpPaths = paths.map((p: string) => p.replace(/(\\|\/)\*$/, ''))

	if (!config.resolve) config.resolve = {}
	if (!config.resolve.alias) config.resolve.alias = {}

	if (config.resolve && config.resolve.alias && !(wpAlias in config.resolve.alias)) {
		config.resolve.alias[wpAlias] = wpPaths.length > 1 ? wpPaths : wpPaths[0]
	}
}

export default config
