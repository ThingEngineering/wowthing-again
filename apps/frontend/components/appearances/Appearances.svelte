<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './AppearancesSidebar.svelte'
    import View from './AppearancesView.svelte'

    export let basePath = ''
    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute(basePath ? `${basePath}/appearances` : 'appearances', params.slug1))
</script>

<div class="view">
    <Sidebar {basePath} />
    
    {#if params.slug1}
        <View
            {params}
        />
    {/if}
</div>
