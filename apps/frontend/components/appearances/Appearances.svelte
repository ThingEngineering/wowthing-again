<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import { appearanceStore, userTransmogStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './AppearancesSidebar.svelte'
    import View from './AppearancesView.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('appearances', params.slug1))

    $: {
        if ($appearanceStore.loaded && !$appearanceStore.error) {
            appearanceStore.setup($userTransmogStore.data)
        }
    }
</script>

<Sidebar />
{#if $appearanceStore.loaded && params.slug1}
    <View {params} />
{/if}
