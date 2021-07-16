<script lang="ts">
    import { onMount } from 'svelte'

    import { error, loading, fetch } from '@/stores/achievements'

    import AchievementsCategory from './AchievementsCategory.svelte'
    import AchievementsRecent from './AchievementsRecent.svelte'
    import AchievementsSidebar from './AchievementsSidebar.svelte'
    import AchievementsScoreSummary from './AchievementsScoreSummary.svelte'

    export let params: {
        slug1: string
        slug2: string
    }

    // Fetch achievement data once when this component is mounted
    onMount(() => {
        if ($loading) {
            fetch()
        }
    })
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    {#if $error}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if $loading}
        <p>L O A D I N G</p>
    {:else}
        <AchievementsSidebar />
        {#if params.slug1 === 'summary'}
            <AchievementsScoreSummary />
            <AchievementsRecent />
        {:else}
            <AchievementsCategory slug1={params.slug1} slug2={params.slug2} />
        {/if}
    {/if}
</div>
