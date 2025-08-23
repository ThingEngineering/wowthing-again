<script lang="ts">
    import { currentTier } from '@/data/gear';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { getTierPieces } from '@/utils/characters/get-tier-pieces';
    import getCharacterGear from '@/utils/get-character-gear';
    import type { CharacterProps } from '@/types/props';

    import Item from './ItemsItem.svelte';

    let { character }: CharacterProps = $props();

    let characterGear = $derived(getCharacterGear(character));
    let tierPieces = $derived(
        getTierPieces(currentTier, wowthingData.items.currentTier, character).map(
            ([, itemId]) => itemId
        )
    );

    let highlightAny = $derived(
        browserState.current.items.highlightEnchants ||
            browserState.current.items.highlightGems ||
            browserState.current.items.highlightHeirlooms ||
            browserState.current.items.highlightItemLevel ||
            browserState.current.items.highlightUpgrades
    );
</script>

<td class="spacer"></td>

{#each characterGear as gear}
    <Item {character} {gear} {tierPieces} useHighlighting={highlightAny} />
{/each}
