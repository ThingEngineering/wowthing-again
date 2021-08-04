<script lang="ts">
    import { data as staticData } from '@/stores/static'
    import { userStore } from '@/stores'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection
    route="pets"
    slug={params.slug}
    thingType="npc"
    thingMap={$staticData.creatureToPet}
    userHas={$userStore.data.mounts}
    sets={$staticData.petSets}
/>
