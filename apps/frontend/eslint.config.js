import globals from 'globals';

import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';

export default [
    {
        ignores: [
            'dist',
            'vite.config.ts',
            'types/bops.gen.ts', // auto-generated
        ],
    },

    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es6,
            },
        },
    },

    // JS
    // {
    //     files: ['**/*.js', '**/*.cjs'],
    // },

    // // TS
    // {
    //     files: ['**/*.ts'],
    //     ignores: [],
    //     languageOptions: {
    //         parser: typescriptParser,
    //         parserOptions: {
    //             project: 'tsconfig.json',
    //         },
    //     },
    //     plugins: {
    //         '@typescript-eslint': typescriptPlugin,
    //     },
    //     rules: {
    //         ...typescriptPlugin.configs.recommended.rules,
    //         ...ourRules,
    //     },
    // },

    // Svelte
    {
        files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        languageOptions: {
            // parser: svelteParser,
            parserOptions: {
                extraFileExtensions: ['.svelte'],
                parser: ts.parser,
                // project: 'tsconfig.json',
                projectService: true,
            },
        },
    },
    {
        rules: {
            // don't break CI for things that are not the end of the world
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            // there's a lot of these to embed '&nbsp;', no user data is ever used
            'svelte/no-at-html-tags': 'off',
            // TODO: fix the hundreds of these
            'svelte/require-each-key': 'warn',
            // ehhhh
            'svelte/prefer-svelte-reactivity': 'warn',
        },
    },
];
