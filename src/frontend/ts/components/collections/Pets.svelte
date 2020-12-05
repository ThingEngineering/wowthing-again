<script lang="ts">
    import { data as staticData } from '../../stores/static-store'
    import { data as userData } from '../../stores/user-store'

    import Collection from './Collection.svelte'
</script>

<Collection thingType="npc" thingMap={$staticData.CreatureToPet} userHas={$userData.pets} sets={$staticData.PetSets} />
