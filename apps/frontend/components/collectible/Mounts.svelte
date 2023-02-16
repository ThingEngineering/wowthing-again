<script lang="ts">

    import { lazyStore, staticStore, userStore}  from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collectible from './Collectible.svelte'

    export let basePath = ''
    export let params: MultiSlugParams

    const thingMapFunc = (thing: number) => $staticStore.mounts[thing]?.spellId
</script>

<Collectible
    route={basePath ? `${basePath}/mounts` : 'mounts'}
    sets={$lazyStore.mounts.filteredCategories}
    thingType="spell"
    userHas={$userStore.hasMount}
    {params}
    {thingMapFunc}
/>
