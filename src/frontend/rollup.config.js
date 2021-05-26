import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import map from 'lodash/map'

import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import rimraf from 'rimraf'
import css from 'rollup-plugin-css-only'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import autoPreprocess from 'svelte-preprocess'


const production = !process.env.ROLLUP_WATCH
const distPath = '../Wowthing.Web/wwwroot/dist'
const buildMe = ['home', 'teams']


// Ensure distPath exists and is relatively empty
fs.mkdirSync(distPath, { recursive: true })

buildMe.forEach((baseName) => rimraf.sync(path.join(distPath, `${baseName}.*`)))

const sigh = function(baseName) {
    return {
        input: path.join('ts', `${baseName}.ts`),
        output: {
            sourcemap: !production,
            format: 'iife',
            name: 'app',
            dir: distPath,
            entryFileNames: production ? '[name].[hash].js' : '[name].dev.js',
        },
        plugins: [
            svelte({
                compilerOptions: {
                    // enable run-time checks when not in production
                    dev: !production,
                },
                preprocess: autoPreprocess(),
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
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
            }),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            typescript({
                cacheDir: '.tscache',
                sourceMap: !production,
                inlineSources: !production
            }),
            alias({
                resolve: ['.svelte', '.ts'],
                entries: [
                    { find: '@', replacement: path.resolve(__dirname, 'ts') },
                ]
            }),

            // Watch the `dist` directory and refresh the
            // browser on changes when not in production
            //!production && livereload(distPath),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser(),
        ],
        watch: {
            include: ['scss/**/*', 'ts/**/*'],
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
