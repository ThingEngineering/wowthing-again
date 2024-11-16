<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { settingsStore } from '@/shared/stores/settings'
    import { achievementStore, userAchievementStore } from '@/stores'
    import { achievementState } from '@/stores/local-storage'
    import getSavedRoute from '@/utils/get-saved-route'
    
    import Category from './Category.svelte'
    import ScoreSummary from './ScoreSummary.svelte'
    import Sidebar from './Sidebar.svelte'
    
    export let params: {
        slug1: string
        slug2: string
    }

    // Fetch achievement data once when this component is mounted
    onMount(async () => await Promise.all([
        achievementStore.fetch({ language: $settingsStore.general.language }),
        //userAchievementStore.fetch(),
    ]))

    afterUpdate(() => getSavedRoute('achievements', params.slug1, params.slug2))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $achievementStore.error || $userAchievementStore.error
        loaded = $achievementStore.loaded && $userAchievementStore.loaded
        ready = false
        if (!error && loaded) {
            userAchievementStore.setup(
                $achievementState,
                $achievementStore
            )
            ready = true
        }
    }
</script>

<div class="view">
    {#if error}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if !ready}
        <p>L O A D I N G</p>
    {:else}
        <Sidebar />
        {#if params.slug1 === 'summary'}
            <ScoreSummary />
        {:else if params.slug1}
            <Category slug1={params.slug1} slug2={params.slug2} />
        {/if}
    {/if}
</div>
