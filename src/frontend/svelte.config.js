const sveltePreprocess = require('svelte-preprocess')

module.exports = {
    preprocess: sveltePreprocess({
        scss: {
            prependData: `@import 'scss/variables.scss';`
        },
    }),
}
