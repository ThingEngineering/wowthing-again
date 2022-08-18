<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import { appearanceStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    export let params: MultiSlugParams

    import Sidebar from './AppearancesSidebar.svelte'
    import View from './AppearancesView.svelte'

    afterUpdate(() => getSavedRoute('appearances', params.slug1))
</script>

<Sidebar />
{#if $appearanceStore.loaded && params.slug1}
    <View {params} />
{/if}
