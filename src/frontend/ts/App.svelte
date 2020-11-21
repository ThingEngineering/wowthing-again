<script lang="ts">
    import { onMount } from 'svelte'
    import Router from 'svelte-spa-router'

    import { error as staticError, loading as staticLoading, fetch as fetchStatic } from './stores/static-store'
    import { error as userError, loading as userLoading, fetch as fetchUser } from './stores/user-store'

    import Home from './components/Home.svelte'
    import Settings from './components/Settings.svelte'
    import Sidebar from './components/Sidebar.svelte'

    const routes = {
        '/': Home,
        '/settings': Settings,
    }

    onMount(() => fetchStatic())
    onMount(() => fetchUser())
</script>

<style lang="scss" global>
    @import "../scss/global.scss";
</style>

<Sidebar />
<div style="width: 100%">
    {#if $staticError || $userError}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if $staticLoading || $userLoading}
        <p>L O A D I N G</p>
    {:else}
        <Router {routes} />
    {/if}
</div>
