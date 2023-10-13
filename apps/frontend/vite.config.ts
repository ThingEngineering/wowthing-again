 /**
  * Change this to `true` to generate source maps alongside your production bundle. This is useful for debugging, but
  * will increase total bundle size and expose your source code.
  */
 const sourceMapsInProduction = true

 /*********************************************************************************************************************/
/**********                                              Vite                                               **********/
/*********************************************************************************************************************/

import { defineConfig, splitVendorChunkPlugin, type Alias, type UserConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import autoprefixer from 'autoprefixer'
//import pkg from './package.json'
import tsconfig from './tsconfig.json'

const production = process.env.NODE_ENV === 'production'
const config = <UserConfig> defineConfig({
	plugins: [
		splitVendorChunkPlugin(),
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

			hot: !production,
			prebundleSvelteLibraries: true,
		}),
	],
	build: {
		manifest: true,
		rollupOptions: {
			input: {
				auctions: 'auctions/entrypoint.ts',
				home: 'apps/home.ts',
				leaderboards: 'leaderboards/entrypoint.ts',
			},
			output: {
				assetFileNames: 'dist/assets/[name]-[hash][extname]',
				chunkFileNames: 'dist/assets/[name]-[hash].js',
				entryFileNames: 'dist/assets/[name]-[hash].js',
			},
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
	/*esbuild: {
		keepNames: true,
	},*/
	// optimizeDeps: {
	// 	disabled: false,
	// },
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
const aliases = tsconfig.compilerOptions.paths as Record<string, string[]>

const newAliases: Alias[] = []
for (const alias in aliases) {
	const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p))

	// Our tsconfig uses glob path formats, whereas webpack just wants directories
	// We'll need to transform the glob format into a format acceptable to webpack

	const wpAlias = alias.replace(/(\\|\/)\*$/, '')
	const wpPaths = paths.map((p: string) => p.replace(/(\\|\/)\*$/, ''))

	if (!config.resolve) config.resolve = {}
	if (!config.resolve.alias) config.resolve.alias = []

	if (config.resolve && config.resolve.alias && !(wpAlias in config.resolve.alias)) {
		newAliases.push({ find: wpAlias, replacement: wpPaths[0] })
	}
}

config.resolve.alias = newAliases

export default config
