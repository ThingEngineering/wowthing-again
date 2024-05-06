import 'vite/modulepreload-polyfill';

import '../scss/global.scss';

import App from './Main.svelte';

import { settingsStore } from '@/shared/stores/settings';

const appTarget = document.querySelector('#app');
const app = appTarget ? new App({ target: appTarget }) : null;

export default app;
