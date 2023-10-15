<script lang="ts">
    import { staticStore } from '@/shared/stores/static'
    import type { Character } from '@/types'

    //import Talents from './CharacterSpecializationsTalents.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'

    export let character: Character

    let specIds: number[]
    $: {
        specIds = $staticStore.characterClasses[character.classId].specializationIds
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
