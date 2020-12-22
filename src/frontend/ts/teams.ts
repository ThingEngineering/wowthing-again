import Teams from './apps/Teams.svelte'

const target = document.querySelector('#app');
const app = target ? new Teams({ target }) : null

export default app
