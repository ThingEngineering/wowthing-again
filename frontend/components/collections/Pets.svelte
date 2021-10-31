<script lang="ts">
    import { staticStore, userCollectionStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams
</script>

<Collection
    route="pets"
    {params}
    thingType="npc"
    thingMap={$staticStore.data.creatureToPet}
    userHas={$userCollectionStore.data.petsHas}
    sets={$staticStore.data.petSets}
/>
