<script lang="ts">
    import { onMount } from 'svelte'
    import Router from 'svelte-spa-router'

    import Sidebar from './components/Sidebar.svelte'
    import Home from './routes/Home.svelte'
    import Settings from './routes/Settings.svelte'

    import { error as staticError, loading as staticLoading, fetch as staticFetch } from './stores/static-store'

    const routes = {
        '/': Home,
        '/settings': Settings,
    }

    onMount(() => staticFetch())
</script>

<style lang="scss" global>
    @import "../scss/global.scss";
</style>

<Sidebar />
<div>
    {#if $staticError}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if $staticLoading}
        <p>L O A D I N G</p>
    {:else}
        <Router {routes} />
    {/if}
</div>
