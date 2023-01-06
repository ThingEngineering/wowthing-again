<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { achievementStore, settingsStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('progress', params.slug1, params.slug2))

    onMount(async () => await achievementStore.fetch({ language: $settingsStore.general.language }))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <ProgressSidebar />
    {#if params.slug1 && $achievementStore.loaded}
        <ProgressTable slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
