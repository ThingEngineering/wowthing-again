<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { CharacterProps } from '@/types/props';

    //import Talents from './CharacterSpecializationsTalents.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte';

    let { character }: CharacterProps = $props();

    let specIds = $derived(
        wowthingData.static.characterClassById.get(character.classId).specializationIds
    );
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
    {#each specIds as specializationId (specializationId)}
        {specializationId}
        <!--<Talents
            {character}
            {specializationId}
        />-->
    {/each}
</div>
