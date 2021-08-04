<script lang="ts">
    import { onMount } from 'svelte'

    import {
        error as staticError,
        loading as staticLoading,
        fetch as fetchStatic,
    } from '@/stores/static'
    import {
        error as teamError,
        loading as teamLoading,
        fetch as fetchTeam,
    } from '@/stores/team'

    import Routes from './AppTeamsRoutes.svelte'
    import Sidebar from './AppTeamsSidebar.svelte'

    onMount(async () => await fetchStatic())
    onMount(async () => await fetchTeam())
</script>

<style lang="scss" global>
    //@import "../../scss/global.scss";
</style>

<Sidebar />
{#if $staticError || $teamError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $staticLoading || $teamLoading}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
