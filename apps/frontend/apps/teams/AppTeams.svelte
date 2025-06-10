<script lang="ts">
    import { onMount } from 'svelte';

    import { error as teamError, loading as teamLoading, fetch as fetchTeam } from '@/stores/team';

    import Routes from './AppTeamsRoutes.svelte';
    import Sidebar from './AppTeamsSidebar.svelte';

    onMount(async () => await fetchTeam());
</script>

<Sidebar />
{#if $teamError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $teamLoading}
    <p>L O A D I N G</p>
{:else}
    <Routes />
{/if}
