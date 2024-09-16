import path from 'path';
import { fileURLToPath } from 'url';

import { sveltePreprocess } from 'svelte-preprocess';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
    preprocess: sveltePreprocess({
        scss: {
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
};

export default config;
