<script lang="ts">
    import { Constants } from '@/data/constants'
    import { experiencePerLevel } from '@/data/experience'
    import { timeStore } from '@/shared/stores/time'
    import { getCharacterLevel } from '@/utils/get-character-level'
    import { getCharacterRested } from '@/utils/get-character-rested'
    import type { Character } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let character: Character

    $: levelData = getCharacterLevel(character)
    $: [rested, restedRemaining] = getCharacterRested($timeStore, character)
</script>

<style lang="scss">
    div {
        width: 10rem;
    }
    p {
        margin: 0.2rem 0;
        text-align: center;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Level {levelData.level}</h5>
    
    {#if levelData.level < Constants.characterMaxLevel}
        <ProgressBar
            have={levelData.xp}
            total={experiencePerLevel[levelData.level]}
            shortText={true}
        />

        {#if rested}
            <p>Rested: {rested}</p>

            {#if restedRemaining}
                <p>{@html restedRemaining}</p>
            {/if}
        {/if}
    {/if}
</div>
