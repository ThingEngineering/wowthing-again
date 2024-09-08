import globals from 'globals';

import js from '@eslint/js';
import svelteParser from 'svelte-eslint-parser';
import sveltePlugin from 'eslint-plugin-svelte';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const ourRules = {
    // don't break CI for things that are not the end of the world
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
};

export default [
    {
        ignores: ['dist', 'svelte.config.cjs', 'vite.config.ts'],
    },

    js.configs.recommended,

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es6,
            },
        },
    },

    // JS
    {
        files: ['**/*.js', '**/*.cjs'],
    },

    // TS
    {
        files: ['**/*.ts'],
        ignores: [],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...ourRules,
        },
    },

    // Svelte
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                extraFileExtensions: ['.svelte'],
                parser: typescriptParser,
                project: './tsconfig.json',
                svelteFeatures: {
                    experimentalGenerics: true,
                },
            },
        },
        plugins: {
            svelte: sveltePlugin,
            '@typescript-eslint': typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...sveltePlugin.configs.recommended.rules,
            ...ourRules,
            // there's a lot of these to embed '&nbsp;', no user data is ever used
            'svelte/no-at-html-tags': 'off',
            // // doesn't seem to work properly?
            // 'svelte/no-unused-svelte-ignore': 'warn',
        },
    },
];
