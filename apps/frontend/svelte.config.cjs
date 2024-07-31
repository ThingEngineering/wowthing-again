/* eslint-disable no-undef */
const path = require('path')
const sveltePreprocess = require('svelte-preprocess')

// eslint-disable-next-line no-undef
module.exports = {
    preprocess: sveltePreprocess({
        scss: {
            // eslint-disable-next-line no-undef
            includePaths: [path.join(__dirname, 'scss')],
            prependData: `
@import 'mixins.scss';
@import 'variables.scss';
`,
        },
    }),
    vitePlugin: {
        // include, exclude, emitCss, hot, ignorePluginPreprocessors, disableDependencyReinclusion, experimental
    },
}
