<script lang="ts">
    import { Constants } from '@/data/constants';
    import type { ConvertibleCategory } from './types';
    import type { Character } from '@/types';

    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let character: Character;
    export let season: ConvertibleCategory;
    export let tier: number;

    $: seasonTier = season.tiers[season.tiers.length - tier];

    let currencies: [number?, number?, number?][][];
    $: {
        currencies = [];

        const first: [number, number][] = [];
        if (season.conversionCurrencyId) {
            first.push([season.conversionCurrencyId, 1]);
        }
        if (seasonTier.lowUpgrade || seasonTier.highUpgrade) {
            first.push([Constants.currencies.itemUpgrade, 1]);
        }
        currencies.push(first);

        if (season.id === 3) {
            if (tier === 2 || tier === 3) {
                currencies.push([[2122, 1]], [[204276, 1]]);
            }
        } else {
            const tier: [number, number, number?][] = [];
            if (seasonTier.lowUpgrade?.length > 0) {
                const upgrade = seasonTier.lowUpgrade[0];
                tier.push([upgrade.upgradeId, upgrade.upgradeCost, upgrade.achievementUpgradeCost]);
            }
            if (seasonTier.highUpgrade?.length > 0) {
                const upgrade = seasonTier.highUpgrade[0];
                tier.push([upgrade.upgradeId, upgrade.upgradeCost, upgrade.achievementUpgradeCost]);
            }
            if (tier.length > 0) {
                currencies.push(tier);
            }
        }

        if (season.purchases?.length > 0) {
            const purchaseCurrencies: [number?, number?][] = [];
            const seenCostIds = new Set<number>();
            for (const purchaseData of season.purchases) {
                if (!seenCostIds.has(purchaseData.costId)) {
                    seenCostIds.add(purchaseData.costId);
                    purchaseCurrencies.push([purchaseData.costId, 1] as [number?, number?]);
                }
            }
            currencies.push(purchaseCurrencies);
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width(3.5rem);

        border-left: 1px solid var(--border-color);
    }
    .flex-wrapper {
        // --image-margin-top: -3px !important;

        flex-direction: column;

        :global(a) {
            align-items: center;
            justify-content: space-between;
            display: flex;
            width: 100%;
        }
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
                    {@const charHas =
                        currencyId > 10_000
                            ? character.getItemCount(currencyId)
                            : character.currencies?.[currencyId]?.quantity || 0}
                    <div class="character-currency">
                        <WowheadLink
                            id={currencyId}
                            type={currencyId > 10_000 ? 'item' : 'currency'}
                        >
                            <WowthingImage
                                name={currencyId > 10_000
                                    ? `item/${currencyId}`
                                    : `currency/${currencyId}`}
                                size={16}
                                border={1}
                            />

                            <span
                                class="drop-shadow"
                                class:status-success={charHas >= currencyAmount}
                            >
                                {charHas}
                            </span>
                        </WowheadLink>
                    </div>
                {/each}
            </div>
        </td>
    {/if}
{/each}
