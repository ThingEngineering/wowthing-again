<script lang="ts">
    import {onMount} from 'svelte'

    import {error as staticError, loading as staticLoading, fetch as fetchStatic} from '../../stores/static-store'
    import {error as teamError, loading as teamLoading, fetch as fetchTeam} from '../../stores/team-store'

    import Team from '../../components/team/Team.svelte'

    onMount(() => fetchStatic())
    onMount(() => fetchTeam())
</script>

<style lang="scss" global>
    //@import "../../scss/global.scss";
</style>

{#if $staticError || $teamError}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if $staticLoading || $teamLoading}
    <p>L O A D I N G</p>
{:else}
    <Team />
{/if}
