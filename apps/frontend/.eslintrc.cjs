module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        extraFileExtensions: ['.svelte'],
    },
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
    ],
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
    ],
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        // doesn't seem to work properly?
        'svelte/no-unused-svelte-ignore': 'warn',
        // there's a lot of these to embed '&nbsp;', no user data is ever used
        'svelte/no-at-html-tags': 'off',
    },
    settings: {
    },
}
