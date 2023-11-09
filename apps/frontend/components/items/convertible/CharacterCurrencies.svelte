<script lang="ts">
    import type { ConvertibleCategory } from './types'
    import type { Character } from '@/types'

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    export let character: Character
    export let season: ConvertibleCategory
    export let tier: number

    $: seasonTier = season.tiers[season.tiers.length - tier]

    let currencies: [number, number][][]
    $: {
        currencies = []
        
        if (season.conversionCurrencyId) {
            currencies.push([[season.conversionCurrencyId, 1]])
        }

        if (season.id === 3) {
            if (tier === 2 || tier === 3) {
                currencies.push([[2122, 1]], [[204276, 1]])
            }
        }
        else {
            currencies.push(seasonTier.lowUpgrade || [], seasonTier.highUpgrade || [])
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(3rem);

        border-left: 1px solid $border-color;
    }
    .flex-wrapper {
        --image-margin-top: -3px !important;

        flex-direction: column;
    }
    .character-currency {
        align-items: center;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
</style>

{#each currencies as currencySets}
    {#if currencySets.length > 0}
        <td>
            <div class="flex-wrapper">
                {#each currencySets as [currencyId, currencyAmount]}
                    {@const charHas = currencyId > 10_000
                        ? character.getItemCount(currencyId)
                        : (character.currencies?.[currencyId]?.quantity || 0)}
                    <div class="character-currency">
                        <WowheadLink
                            id={currencyId}
                            type={currencyId > 10_000 ? 'item' : 'currency'}
                        >
                            <WowthingImage
                                name={currencyId > 10_000 ? `item/${currencyId}` : `currency/${currencyId}`}
                                size={16}
                                border={1}
                            />
                        </WowheadLink>
                        <span
                            class="drop-shadow"
                            class:status-success={charHas >= currencyAmount}
                        >
                            {charHas}
                        </span>
                    </div>
                {/each}
            </div>
        </td>
    {/if}
{/each}
