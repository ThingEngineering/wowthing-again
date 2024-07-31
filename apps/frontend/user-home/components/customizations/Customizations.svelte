<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let basePath = ''
    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute(basePath ? `${basePath}/customizations` : 'customizations', params.slug1, params.slug2))
</script>

<div class="view">
    <Sidebar {basePath} />

    {#if params.slug1 && params.slug2}
        <View {params} />
    {/if}
</div>
