<script lang="ts">
    import { convertibleCategories } from '@/components/items/convertible/data';
    import { Constants } from '@/data/constants';
    import { currentTier, previousTier } from '@/data/gear';
    import { InventoryType } from '@/enums/inventory-type';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { lazyState } from '@/user-home/state/lazy';
    import { getTierPieces } from '@/utils/characters/get-tier-pieces';
    import type { CharacterProps } from '@/types/props';
    import type { LazyConvertibleCharacterItem } from '@/user-home/state/lazy/convertible.svelte';

    import TooltipSet from '@/components/tooltips/tier-set/TooltipTierSet.svelte';

    type GearPieces = [string, number, number, LazyConvertibleCharacterItem?][];

    let { character }: CharacterProps = $props();

    let { currentCount, currentPieces, previousCount, previousPieces } = $derived.by(() => {
        const ret: {
            currentCount: number;
            previousCount: number;
            currentPieces: GearPieces;
            previousPieces: GearPieces;
        } = {
            currentCount: 0,
            previousCount: 0,
            currentPieces: [],
            previousPieces: [],
        };

        ret.currentPieces = getTierPieces(currentTier, wowthingData.items.currentTier, character);
        ret.currentCount = ret.currentPieces.filter(([, itemId]) => itemId > 0).length;

        if (previousTier) {
            ret.previousPieces = getTierPieces(
                previousTier,
                wowthingData.items.previousTier,
                character
            );
            ret.previousCount = ret.previousPieces.filter(([, itemId]) => itemId > 0).length;
        }

        // Convertibles
        const category = convertibleCategories[0];
        const seasonData = lazyState.convertible.seasons[category.id][character.classId];
        if (seasonData) {
            slots.forEach((inventoryType, index) => {
                if (ret.currentPieces[index][2] === 0) {
                    const slotData = seasonData[inventoryType];
                    const bestPiece = Object.values(slotData.modifiers)
                        .flatMap((modifier) => modifier.characters[character.id] || [])
                        .filter((item) => item.isConvertible)
                        .reduce((a, b) => (a && a.currentTier > b.currentTier ? a : b), null);
                    if (bestPiece) {
                        ret.currentPieces[index].push(bestPiece);
                    }
                }
            });
        }

        return ret;
    });

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
                propsFunc: () => ({
                    character,
                    tierSets: [currentPieces, previousPieces],
                }),
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
                propsFunc: () => ({
                    character,
                    tierSets: [currentPieces],
                }),
            }}
        >
            {currentCount} pc
        </td>
    {/if}
{:else}
    <td></td>
{/if}
