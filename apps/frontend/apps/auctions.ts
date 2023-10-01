import 'vite/modulepreload-polyfill'

import '../scss/global.scss'

import App from './auctions/AppAuctions.svelte'

const appTarget = document.querySelector('#app')
const app = appTarget ? new App({ target: appTarget }) : null

export default app
