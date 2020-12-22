import Home from './apps/Home.svelte'

const target = document.querySelector('#app');
const app = target ? new Home({ target }) : null

export default app
