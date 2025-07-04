<script lang="ts">
    import { convertibleCategories } from '@/components/items/convertible/data';
    import { Constants } from '@/data/constants';
    import { currentTier, previousTier } from '@/data/gear';
    import { InventoryType } from '@/enums/inventory-type';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyState } from '@/user-home/state/lazy';
    import { getTierPieces } from '@/utils/characters/get-tier-pieces';
    import type { Character } from '@/types';
    import type { LazyConvertibleCharacterItem } from '@/user-home/state/lazy/convertible.svelte';

    import TooltipSet from '@/components/tooltips/tier-set/TooltipTierSet.svelte';

    export let character: Character;

    let currentCount: number;
    let currentPieces: [string, number, number, LazyConvertibleCharacterItem?][];
    let previousCount: number;
    let previousPieces: [string, number, number, LazyConvertibleCharacterItem?][];
    $: {
        currentPieces = getTierPieces(currentTier, wowthingData.items.currentTier, character);
        currentCount = currentPieces.filter(([, itemId]) => itemId > 0).length;

        if (previousTier) {
            previousPieces = getTierPieces(
                previousTier,
                wowthingData.items.previousTier,
                character
            );
            previousCount = previousPieces.filter(([, itemId]) => itemId > 0).length;
        } else {
            previousPieces = [];
            previousCount = 0;
        }

        // Convertibles
        const category = convertibleCategories[0];
        const seasonData = lazyState.convertible.seasons[category.id][character.classId];
        if (!seasonData) {
            break $;
        }

        slots.forEach((inventoryType, index) => {
            if (currentPieces[index][2] === 0) {
                const slotData = seasonData[inventoryType];
                const bestPiece = Object.values(slotData.modifiers)
                    .flatMap((modifier) => modifier.characters[character.id] || [])
                    .filter((item) => item.isConvertible)
                    .reduce((a, b) => (a && a.currentTier > b.currentTier ? a : b), null);
                if (bestPiece) {
                    currentPieces[index].push(bestPiece);
                }
            }
        });
    }

    const slots = [
        InventoryType.Head,
        InventoryType.Shoulders,
        InventoryType.Chest,
        InventoryType.Hands,
        InventoryType.Legs,
    ];
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear, $maxWidth: $width-home-gear-max);

        --link-color: #{$quality5-color};

        border-left: 1px solid var(--border-color);
        text-align: center;
        word-spacing: -0.1ch;
    }
    .faded {
        color: #aaa;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    {#if previousCount > 0 && currentCount < 4}
        <td
            use:componentTooltip={{
                component: TooltipSet,
                props: {
                    character,
                    tierSets: [currentPieces, previousPieces],
                },
            }}
        >
            <span
                class:status-shrug={currentCount >= 2 && currentCount < 4}
                class:status-success={currentCount >= 4}
            >
                {currentCount}
            </span>
            <span class="faded">/</span>
            <span
                class:status-shrug={previousCount >= 2 && previousCount < 4}
                class:status-success={previousCount >= 4}
            >
                {previousCount}
            </span>
        </td>
    {:else}
        <td
            class:status-shrug={currentCount >= 2 && currentCount < 4}
            class:status-success={currentCount >= 4}
            class:faded={currentCount + previousCount === 0}
            use:componentTooltip={{
                component: TooltipSet,
                props: {
                    character,
                    tierSets: [currentPieces],
                },
            }}
        >
            {currentCount} pc
        </td>
    {/if}
{:else}
    <td></td>
{/if}
