module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        es6: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    plugins: [
        '@typescript-eslint',
        'svelte3',
    ],
    settings: {
        'svelte3/ignore-styles': () => true, // ignore styles, SASS breaks things
        'svelte3/typescript': true, // load TypeScript as a peer dependency
    },
}
