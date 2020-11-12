import crypto from 'crypto'

import rimraf from 'rimraf'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import livereload from 'rollup-plugin-livereload'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'


const production = !process.env.ROLLUP_WATCH
console.log('production', production)

rimraf.sync('wwwroot/dist')

function serve() {
    let server
    
    function toExit() {
        if (server) server.kill(0)
    }

    return {
        writeBundle() {
            if (server) return
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            })

            process.on('SIGTERM', toExit)
            process.on('exit', toExit)
        }
    }
}

export default {
    input: 'frontend/ts/main.ts',
    output: {
        sourcemap: !production,
        format: 'iife',
        name: 'app',
        dir: 'wwwroot/dist',
        entryFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            css: (css) => {
                const hash = crypto.createHash('md5').update(css.code).digest('hex').substr(0, 8)
                css.write(`main.${hash}.css`, !production)
            },
            preprocess: sveltePreprocess(),
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `dist` directory and refresh the
        // browser on changes when not in production
        !production && livereload('wwwroot/dist'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false
    }
}
