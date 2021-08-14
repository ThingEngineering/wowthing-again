<script lang="ts">
    import { staticStore } from '@/stores/static'
    import { userStore } from '@/stores'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection
    route="pets"
    slug={params.slug}
    thingType="npc"
    thingMap={$staticStore.data.creatureToPet}
    userHas={$userStore.data.mounts}
    sets={$staticStore.data.petSets}
/>
