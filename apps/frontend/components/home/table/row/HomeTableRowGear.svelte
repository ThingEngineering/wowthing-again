<script lang="ts">
    import { convertibleCategories } from '@/components/items/convertible/data';
    import { Constants } from '@/data/constants'
    import { currentTier, previousTier } from '@/data/gear'
    import { InventoryType } from '@/enums/inventory-type';
    import { componentTooltip } from '@/shared/utils/tooltips'
    import { itemStore, lazyStore } from '@/stores'
    import { getTierPieces } from '@/utils/characters/get-tier-pieces'
    import { toNiceNumber } from '@/utils/formatting';
    import type { LazyConvertibleCharacterItem } from '@/stores/lazy/convertible';
    import type { Character } from '@/types'

    import TooltipRemix from '@/components/tooltips/remix-cloak/TooltipRemixCloak.svelte'
    import TooltipSet from '@/components/tooltips/tier-set/TooltipTierSet.svelte'

    export let character: Character

    let currentCount: number
    let currentPieces: [string, number, number, LazyConvertibleCharacterItem?][]
    let previousCount: number
    let previousPieces: [string, number, number, LazyConvertibleCharacterItem?][]
    $: {
        currentPieces = getTierPieces(currentTier, $itemStore.currentTier, character)
        currentCount = currentPieces
            .filter(([, itemId]) => itemId > 0)
            .length

        if (previousTier) {
            previousPieces = getTierPieces(previousTier, $itemStore.previousTier, character)
            previousCount = previousPieces
                .filter(([, itemId]) => itemId > 0)
                .length
        }
        else {
            previousPieces = []
            previousCount = 0
        }

        // Convertibles
        const category = convertibleCategories[0]
        const seasonData = $lazyStore.convertible.seasons[category.id][character.classId]
        
        slots.forEach((inventoryType, index) => {
            if (currentPieces[index][2] === 0) {
                const slotData = seasonData[inventoryType]
                const bestPiece = Object.values(slotData.modifiers)
                    .flatMap((modifier) => modifier.characters[character.id] || [])
                    .filter((item) => item.canConvert)
                    .reduce((a, b) => (a && a.equippedItem.itemLevel > b.equippedItem.itemLevel) ? a : b, null)
                if (bestPiece) {
                    currentPieces[index].push(bestPiece)
                }
            }
        })
    }

    const getRemixTotal = (char: Character) => {
        return [2853, 2854, 2855, 2856, 2857, 2858, 2859, 2860, 3001]
            .reduce((total, currencyId) => total + char.currencies?.[currencyId]?.quantity || 0, 0)
    }

    const slots = [InventoryType.Head, InventoryType.Shoulders, InventoryType.Chest, InventoryType.Hands, InventoryType.Legs]
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear, $maxWidth: $width-home-gear-max);

        --link-color: #{ $quality5-color };

        border-left: 1px solid $border-color;
        text-align: center;
        word-spacing: -0.1ch;
    }
    .faded {
        color: #aaa;
    }
</style>

{#if character.isRemix}
    {@const total = getRemixTotal(character)}
    <td
        style="text-align: right"
        use:componentTooltip={{
            component: TooltipRemix,
            props: {
                character,
                total,
            },
        }}
    >
        {toNiceNumber(total)}
    </td>
{:else if character.level === Constants.characterMaxLevel}
    {#if previousCount > 0}
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
            class:faded={(currentCount + previousCount) === 0}
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
