<script lang="ts">
    import { Constants } from '@/data/constants'
    import { experiencePerLevel } from '@/data/experience'
    import type { Character } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'

    export let character: Character

    let level: number
    let xp: number
    $: {
        const addonLevel = character.addonLevel || 0
        if (character.level > addonLevel) {
            level = character.level
            xp = 0
        }
        else {
            level = addonLevel
            xp = character.addonLevelXp || 0
        }
    }
</script>

<style lang="scss">
    div {
        width: 10rem;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Level {level}</h5>
    
    {#if level < Constants.characterMaxLevel}
        <ProgressBar
            have={xp}
            total={experiencePerLevel[level]}
            shortText={true}
        />
    {/if}
</div>
