<script lang="ts">
    import { staticStore } from '@/stores'
    import type { Character } from '@/types'

    import Talents from './CharacterSpecializationsTalents.svelte'

    export let character: Character

    let specIds: number[]
    $: {
        specIds = $staticStore.data.characterClasses[character.classId].specializationIds
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
