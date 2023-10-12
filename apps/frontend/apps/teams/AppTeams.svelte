<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore } from '@/shared/stores/static'
    import {
        error as teamError,
        loading as teamLoading,
        fetch as fetchTeam,
    } from '@/stores/team'

    import Routes from './AppTeamsRoutes.svelte'
    import Sidebar from './AppTeamsSidebar.svelte'

    onMount(async () => await staticStore.fetch())
    onMount(async () => await fetchTeam())
</script>

<style lang="scss" global>
    //@import "../../scss/global.scss";
</style>

<Sidebar />
{#if $staticStore.error || $teamError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !$staticStore.loaded || $teamLoading}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
