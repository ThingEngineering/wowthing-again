<script lang="ts">
    import { data as staticData } from '@/stores/static-store'
    import { data as userData } from '@/stores/user-store'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection route="pets" slug={params.slug} thingType="npc" thingMap={$staticData.CreatureToPet} userHas={$userData.pets} sets={$staticData.PetSets} />
