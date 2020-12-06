<script lang="ts">
    import { data as staticData } from '../../stores/static-store'
    import { data as userData } from '../../stores/user-store'

    import Collection from './Collection.svelte'

    export let params: { slug }
</script>

<Collection route="mounts" slug={params.slug} thingType="spell" thingMap={$staticData.SpellToMount} userHas={$userData.mounts} sets={$staticData.MountSets} />
