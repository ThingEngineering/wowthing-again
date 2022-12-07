<script lang="ts">
    import { Constants } from '@/data/constants'
    import { experiencePerLevel } from '@/data/experience'
    import type { Character } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import { getCharacterLevel } from '@/utils/get-character-level';

    export let character: Character

    $: levelData = getCharacterLevel(character)
</script>

<style lang="scss">
    div {
        width: 10rem;
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
    {/if}
</div>
