module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        es6: true,
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
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
        'svelte3/ignore-styles': () => true, // ignore styles, SASS breaks things
        'svelte3/named-blocks': true, // use named blocks
        'svelte3/typescript': true, // load TypeScript as a peer dependency
    },
}
