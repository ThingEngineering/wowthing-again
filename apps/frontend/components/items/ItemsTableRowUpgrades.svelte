<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Character } from '@/types'
    
    import Tooltip from '@/shared/components/parsed-text/Tooltip.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character

    const currencies: number[][] = [
        [
            2706, // Whelpling's Dreaming Crests
            2707, // Drake's Dreaming Crests
        ],
        [
            2708, // Wyrm's Dreaming Crests
            2709, // Aspect's Dreaming Crests
        ],
    ]
</script>

<style lang="scss">
    .flightstones {
        --image-margin-top: 0;

        border-left: 1px solid $border-color;
        padding: 0 0.4rem 0 0.2rem;
    }
    .flightstones-wrapper {
        align-items: center;
        display: flex;
        gap: 4px;
        justify-content: space-between;
    }
    .crests {
        border-left: 1px solid $border-color;
        padding: 0 0.4rem 0 0.2rem;
    }
    .crests-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        height: 100%;
    }
    .crest {
        line-height: 1;
    }
    .amount {
        display: inline-block;
        text-align: right;
        width: 1.2rem;
    }
    .faded {
        opacity: 0.5;
    }
</style>

<td class="spacer"></td>

<td class="flightstones">
    <div class="flightstones-wrapper">
        <WowthingImage
            border={1}
            name='currency/2245'
            size={24}
        />
        {(character.currencies?.[2245]?.quantity || 0).toLocaleString()}
    </div>
</td>

{#each currencies as currencyIds}
    <td class="crests">
        <div class="crests-wrapper">
            {#each currencyIds as currencyId}
                {@const crests = character.currencies?.[currencyId]?.quantity || 0}
                <div
                    class="crest"
                    use:componentTooltip={{
                        component: Tooltip,
                        props: {
                            content: `{currency:${currencyId}}`,
                        },
                    }}
                >
                    <WowthingImage
                        border={1}
                        name={`currency/${currencyId}`}
                        size={16}
                    />
                    <span
                        class="amount"
                        class:faded={crests === 0}
                        class:status-success={crests >= 15}
                    >
                        {crests}
                    </span>
                </div>
            {/each}
        </div>
    </td>
{/each}
