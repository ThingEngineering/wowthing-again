<script lang="ts">
    import { Constants } from '@/data/constants'
    import { currentTier, previousTier } from '@/data/gear'
    import { itemStore } from '@/stores'
    import { getTierPieces } from '@/utils/characters/get-tier-pieces'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'

    import TooltipRemix from '@/components/tooltips/remix-cloak/TooltipRemixCloak.svelte'
    import TooltipSet from '@/components/tooltips/tier-set/TooltipTierSet.svelte'

    export let character: Character

    let currentCount: number
    let currentPieces: [string, number, number][]
    let previousCount: number
    let previousPieces: [string, number, number][]
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
    }

    const getRemixTotal = () => {
        return [2853, 2854, 2855, 2856, 2857, 2858, 2859, 2860, 3001]
            .reduce((total, currencyId) => total + character.currencies?.[currencyId]?.quantity || 0, 0)
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear);

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
    {@const total = getRemixTotal()}
    <td
        use:componentTooltip={{
            component: TooltipRemix,
            props: {
                character,
                total,
            },
        }}
    >
        {total}
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
    {:else if currentCount > 0}
        <td
            class:status-shrug={currentCount >= 2 && currentCount < 4}
            class:status-success={currentCount >= 4}
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
    {:else}
        <td class="faded">---</td>
    {/if}
{:else}
    <td></td>
{/if}
