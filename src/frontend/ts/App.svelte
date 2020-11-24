<script lang="ts">
    import { onMount } from 'svelte'
    import Router from 'svelte-spa-router'

    import { error as staticError, loading as staticLoading, fetch as fetchStatic } from './stores/static-store'
    import { error as userError, loading as userLoading, fetch as fetchUser } from './stores/user-store'

    import HomeCards from './components/HomeCards.svelte'
    import HomeTable from './components/HomeTable.svelte'
    import Settings from './components/Settings.svelte'
    import Sidebar from './components/Sidebar.svelte'
    import Mounts from './components/collections/Mounts.svelte'

    const routes = {
        '/': HomeTable,
        '/cards': HomeCards,

        '/mounts': Mounts,

        '/settings': Settings,
    }

    onMount(() => fetchStatic())
    onMount(() => fetchUser())
</script>

<style lang="scss" global>
    @import "../scss/global.scss";
</style>

<Sidebar />
{#if $staticError || $userError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $staticLoading || $userLoading}
    <p>L O A D I N G</p>
{:else}
    <Router {routes} />
{/if}
