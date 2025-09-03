import css from "@eslint/css";
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    css.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts'],
        // See more details at: https://typescript-eslint.io/packages/parser/
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: ['.svelte'],
                parser: ts.parser,
                svelteConfig
            }
        }
    },
    {
        rules: {
            indent: ['error', 4],
            'no-multi-spaces': 'error',
            'svelte/indent': ['error', { indent: 4 }],
            'svelte/no-trailing-spaces': 'error',
            'svelte/derived-has-same-inputs-outputs': 'error',
            'svelte/first-attribute-linebreak': 'error',
            'svelte/html-closing-bracket-new-line': 'error',
            'svelte/html-closing-bracket-spacing': 'error',
            'svelte/html-quotes': 'error',
            'svelte/html-self-closing': 'error',
            'svelte/max-attributes-per-line': 'error',
            'svelte/mustache-spacing': 'error',
            'svelte/no-extra-reactive-curlies': 'error',
            'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
            'svelte/prefer-class-directive': 'error',
            'svelte/prefer-style-directive': 'error',
            'svelte/require-event-prefix': 'error',
            'svelte/shorthand-attribute': 'error',
            'svelte/shorthand-directive': 'error',
            'svelte/sort-attributes': 'error',
            'svelte/spaced-html-comment': 'error'
        }
    }
);