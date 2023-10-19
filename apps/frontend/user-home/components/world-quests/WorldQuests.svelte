<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types/params'

    import Map from './Map.svelte'
    import Sidebar from './Sidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('world-quests', params.slug1))
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1}
        <Map expansionSlug={params.slug1} mapSlug={params.slug2} />
    {/if}
</div>
