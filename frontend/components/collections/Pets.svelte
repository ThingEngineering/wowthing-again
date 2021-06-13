<script lang="ts">
    import { data as staticData } from '../../stores/static'
    import { data as userData } from '../../stores/user'

    import Collection from './Collection.svelte'

    export let params: { slug: string }
</script>

<Collection route="pets" slug={params.slug} thingType="npc" thingMap={$staticData.CreatureToPet} userHas={$userData.pets} sets={$staticData.PetSets} />
