<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { achievementStore } from '@/stores'
    import { settingsStore } from '@/user-home/stores/settings'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('progress', params.slug1, params.slug2))

    onMount(async () => await achievementStore.fetch({ language: $settingsStore.general.language }))
</script>

<div class="view">
    <ProgressSidebar />
    {#if params.slug1 && $achievementStore.loaded}
        <ProgressTable slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
