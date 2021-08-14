<script lang="ts">
    import { onMount } from 'svelte'

    import { achievementStore, userAchievementStore, userStore } from '@/stores'

    import AchievementsCategory from './AchievementsCategory.svelte'
    import AchievementsSidebar from './AchievementsSidebar.svelte'
    import AchievementsScoreSummary from './AchievementsScoreSummary.svelte'

    export let params: {
        slug1: string
        slug2: string
    }

    // Fetch achievement data once when this component is mounted
    onMount(async () => await achievementStore.fetch())
    onMount(async () => await userAchievementStore.fetch())

    let error: boolean
    let ready: boolean
    $: {
        const loaded = $achievementStore.loaded && $userAchievementStore.loaded && $userStore.loaded
        error = $achievementStore.error || $userAchievementStore.error || $userStore.error
        ready = (loaded && $userAchievementStore.data.achievementCategories !== null)
        if (loaded) {
            userAchievementStore.setup()
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
    {#if error}
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
