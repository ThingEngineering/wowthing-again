<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { Character } from '@/types';

    //import Talents from './CharacterSpecializationsTalents.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    export let character: Character;

    let specIds: number[];
    $: {
        specIds = wowthingData.static.characterClassById.get(character.classId).specializationIds;
    }
</script>

<style lang="scss">
    .specializations {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        justify-content: center;
    }
</style>

<div class="specializations">
    <UnderConstruction />
    {#each specIds as specializationId}
        {specializationId}
        <!--<Talents
            {character}
            {specializationId}
        />-->
    {/each}
</div>
