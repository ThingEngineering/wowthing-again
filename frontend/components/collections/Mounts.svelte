<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { userStore } from '@/stores'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection
    route="mounts"
    slug={params.slug}
    thingType="spell"
    thingMap={$staticStore.data.spellToMount}
    userHas={$userStore.data.mounts}
    sets={$staticStore.data.mountSets}
/>
