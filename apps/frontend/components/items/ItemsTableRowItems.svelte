<script lang="ts">
    import { currentTier } from '@/data/gear';
    import { wowthingData } from '@/shared/stores/data';
    import { gearState } from '@/stores/local-storage';
    import { getTierPieces } from '@/utils/characters/get-tier-pieces';
    import getCharacterGear from '@/utils/get-character-gear';
    import type { Character, CharacterGear } from '@/types';

    import Item from './ItemsItem.svelte';

    export let character: Character;

    let characterGear: CharacterGear[];
    let tierPieces: number[];
    $: {
        characterGear = getCharacterGear($gearState, character);
        tierPieces = getTierPieces(currentTier, wowthingData.items.currentTier, character).map(
            ([, itemId]) => itemId
        );
    }
</script>

<td class="spacer"></td>

{#each characterGear as gear}
    <Item {character} {gear} {tierPieces} useHighlighting={$gearState.highlightAny} />
{/each}
