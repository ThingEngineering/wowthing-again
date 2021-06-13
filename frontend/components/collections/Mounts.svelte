<script lang="ts">
    import { data as staticData } from '@/stores/static'
    import { data as userData } from '@/stores/user'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection
    route="mounts"
    slug={params.slug}
    thingType="spell"
    thingMap={$staticData.SpellToMount}
    userHas={$userData.mounts}
    sets={$staticData.MountSets}
/>
