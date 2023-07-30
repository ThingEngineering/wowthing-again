import 'vite/modulepreload-polyfill'

import '../scss/global.scss'

import App from './leaderboard/AppLeaderboard.svelte'

const appTarget = document.querySelector('#app')
const app = appTarget ? new App({ target: appTarget }) : null

export default app
