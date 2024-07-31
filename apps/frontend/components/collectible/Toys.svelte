<script lang="ts">
    import { lazyStore, userStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collectible from './Collectible.svelte'

    export let basePath = ''
    export let params: MultiSlugParams
</script>

<Collectible
    route={basePath ? `${basePath}/toys` : 'toys'}
    sets={$lazyStore.toys.filteredCategories}
    thingType="item"
    userHas={$userStore.hasToy}
    {params}
/>
