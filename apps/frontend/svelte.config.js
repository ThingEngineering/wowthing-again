/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
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
}
