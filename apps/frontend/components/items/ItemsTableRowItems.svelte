<script lang="ts">
    import { Constants } from '@/data/constants'
    import { gearState } from '@/stores/local-storage'
    import { getTierPieces } from '@/utils/characters/get-tier-pieces'
    import getCharacterGear from '@/utils/get-character-gear'
    import getFirstMatch from '@/utils/get-first-match'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character, CharacterGear } from '@/types'

    import Item from './ItemsItem.svelte'
    import UpgradeTooltip from '@/components/tooltips/mythic-plus-upgrade/TooltipMythicPlusUpgrade.svelte'

    export let character: Character

    let characterGear: CharacterGear[]
    let score: number
    let tierPieces: number[]
    $: {
        characterGear = getCharacterGear($gearState, character)
        
        score = character.mythicPlusSeasonScores[Constants.mythicPlusSeason]
            || character.raiderIo?.[Constants.mythicPlusSeason]?.all
            || 0

        tierPieces = getTierPieces(character).map(([, itemId,]) => itemId)
    }
</script>

<style lang="scss">
    .max-upgrade {
        border-left: 1px solid $border-color;
        padding: 0.2rem 0.5rem;
    }
</style>

<td class="spacer"></td>

{#each characterGear as gear}
    <Item
        {character}
        {gear}
        {tierPieces}
        useHighlighting={$gearState.highlightAny}
    />
{/each}
