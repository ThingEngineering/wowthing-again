import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import map from 'lodash/map'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import rimraf from 'rimraf'
import css from 'rollup-plugin-css-only'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'


const production = !process.env.ROLLUP_WATCH
const distPath = '../src/Wowthing.Web/wwwroot/dist'
const buildMe = ['home']//, 'teams']
const extensions = ['.js', '.svelte', '.ts']

// Ensure distPath exists and is relatively empty
fs.mkdirSync(distPath, { recursive: true })

buildMe.forEach((baseName) => rimraf.sync(path.join(distPath, `${baseName}.*`)))

const sigh = function(baseName) {
    return {
        input: path.join('apps', `${baseName}.ts`),
        output: {
            sourcemap: !production,
            format: 'iife',
            indent: false,
            name: 'app',
            dir: distPath,
            entryFileNames: production ? '[name].[hash].js' : '[name].dev.js',
        },
        plugins: [
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
            }),
            svelte({
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production,
                },
                preprocess: sveltePreprocess({
                    sourceMap: !production,
                    scss: {
                        prependData: `
@import 'scss/mixins.scss';
@import 'scss/variables.scss';
`
                    },
                }),
            }),
            css({
                output: (css, styleNodes) => {
                    let outputPath = `${baseName}.dev.css`;
                    if (production) {
                        const hash = crypto.createHash('md5')
                            .update(css)
                            .digest('hex')
                            .substr(0, 8)
                        outputPath = `${baseName}.${hash}.css`
                    }
                    fs.writeFileSync(path.join(distPath, outputPath), css)
                },
            }),
            alias({
                resolve: extensions,
                entries: [
                    { find: '@', replacement: path.resolve(__dirname) },
                ]
            }),
            resolve({
                browser: true,
                dedupe: ['svelte'],
                extensions
            }),
            commonjs(),
            typescript({
                //cacheDir: '.tscache',
                //sourceMap: !production,
                //inlineSources: !production
            }),

            // Watch the `dist` directory and refresh the
            // browser on changes when not in production
            //!production && livereload(distPath),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser(),
        ],
        //perf: true,
        treeshake: production,
        watch: {
            exclude: ['node_modules/**'],
            include: ['**/*.css', '**/*.scss', '**/*.svelte', '**/*.ts'],
            chokidar: {
                usePolling: true,
            },
            clearScreen: false
        }
    }
}

const buildAll = (function () {
    return map(buildMe, (basePath) => sigh(basePath))
})()

//console.log(buildAll)

export default buildAll
