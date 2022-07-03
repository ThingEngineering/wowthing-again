import { mergeConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, {
  plugins: [svelte({ hot: !process.env.VITEST })],
});
