<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { userStore } from '@/stores'
    import type {MultiSlugParams} from '@/types'

    import Collection from './Collection.svelte'

    export let params: MultiSlugParams
</script>

<Collection
    route="mounts"
    {params}
    thingType="spell"
    thingMap={$staticStore.data.spellToMount}
    userHas={$userStore.data.mounts}
    sets={$staticStore.data.mountSets}
/>
