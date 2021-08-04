<script lang="ts">
    import { onMount } from 'svelte'

    import { achievementStore, userStore } from '@/stores'
    import { initializeAchievements } from '@/utils/initialize-achievements'

    import AchievementsCategory from './AchievementsCategory.svelte'
    import AchievementsSidebar from './AchievementsSidebar.svelte'
    import AchievementsScoreSummary from './AchievementsScoreSummary.svelte'

    export let params: {
        slug1: string
        slug2: string
    }

    // Fetch achievement data once when this component is mounted
    onMount(async () => {
        if ($achievementStore.loading) {
            await achievementStore.fetch()
        }
    })

    let ready: boolean
    $: {
        ready = !($achievementStore.loading || $userStore.loading || $userStore.data.achievementCategories === null)
        if (!($achievementStore.loading || $userStore.loading)) {
            initializeAchievements()
        }
    }
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    {#if $achievementStore.error}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if !ready}
        <p>L O A D I N G</p>
    {:else}
        <AchievementsSidebar />
        {#if params.slug1 === 'summary'}
            <AchievementsScoreSummary />
        {:else}
            <AchievementsCategory slug1={params.slug1} slug2={params.slug2} />
        {/if}
    {/if}
</div>
