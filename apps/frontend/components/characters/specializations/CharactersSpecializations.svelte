<script lang="ts">
    import { classMap } from '@/data/character-class'
    import type { Character } from '@/types'

    import Talents from './CharacterSpecializationsTalents.svelte'

    export let character: Character

    let specIds: number[]
    $: {
        specIds = classMap[character.classId].specializationIds
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
    {#each specIds as specializationId}
        <Talents
            {character}
            {specializationId}
        />
    {/each}
</div>
