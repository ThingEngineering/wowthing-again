<script lang="ts">
    import { data as staticData } from '@/stores/static'
    import { userStore } from '@/stores'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection
    route="mounts"
    slug={params.slug}
    thingType="spell"
    thingMap={$staticData.spellToMount}
    userHas={$userStore.data.mounts}
    sets={$staticData.mountSets}
/>
