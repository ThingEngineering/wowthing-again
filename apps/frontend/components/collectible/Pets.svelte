<script lang="ts">
    import { lazyStore, staticStore, userStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collectible from './Collectible.svelte'

    export let basePath = ''
    export let params: MultiSlugParams

    const thingMapFunc = (thing: number) => $staticStore.pets[thing]?.creatureId
</script>

<Collectible
    route={basePath ? `${basePath}/pets` : 'pets'}
    sets={$lazyStore.pets.filteredCategories}
    thingType="npc"
    userHas={$userStore.hasPet}
    {params}
    {thingMapFunc}
/>
