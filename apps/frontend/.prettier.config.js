const config = {
    plugins: ['prettier-plugin-svelte'],
    overrides: [{ "files": "*.svelte", "options": { "parser": "svelte" } }],
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
    svelteSortOrder: 'options-scripts-styles-markup',
};

export default config;
