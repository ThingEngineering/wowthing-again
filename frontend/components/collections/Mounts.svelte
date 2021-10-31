<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { userCollectionStore}  from '@/stores'
    import type { MultiSlugParams } from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams
</script>

<Collection
    route="mounts"
    {params}
    thingType="spell"
    thingMap={$staticStore.data.spellToMount}
    userHas={$userCollectionStore.data.mounts}
    sets={$staticStore.data.mountSets}
/>
