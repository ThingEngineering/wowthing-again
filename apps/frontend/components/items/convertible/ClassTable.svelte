<script lang="ts">
    import { convertibleTypes, modifierToTier } from './data';
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { InventoryType } from '@/enums/inventory-type';
    import { uiIcons } from '@/shared/icons';
    import { lazyStore } from '@/stores';
    import { commonColspan } from '@/shared/stores/settings';
    import getPercentClass from '@/utils/get-percent-class';
    import type { ConvertibleCategory } from './types';
    import type { StaticDataCharacterClass } from '@/shared/stores/static/types';
    import type { Character } from '@/types';

    import CharacterCurrencies from './CharacterCurrencies.svelte';
    import CharacterItems from './CharacterItems.svelte';
    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import CharacterTableHead from '@/components/character-table/CharacterTableHead.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    export let modifier: AppearanceModifier;
    export let playerClass: StaticDataCharacterClass;
    export let season: ConvertibleCategory;

    $: data = $lazyStore.convertible.seasons[season.id]?.[playerClass.id];
    $: hasEverySlot = convertibleTypes.every((type) => data?.[type]?.modifiers[modifier]?.userHas);
    $: stats = $lazyStore.convertible.stats[`${season.id}--c${playerClass.id}--m${modifier}`];

    const filterFunc = function (char: Character): boolean {
        return (
            char.level >= season.minimumLevel && char.classId === playerClass.id
            // && some(
            //     Object.values(data),
            //     (slotData) => slotData.modifiers[modifier].characters[char.id] !== undefined
            // )
        );
    };
</script>

<style lang="scss">
    .item-slot {
        @include cell-width(6rem, $paddingLeft: 0px, $paddingRight: 0px);

        border-left: 1px solid $border-color;
        text-align: center;
    }
    .flex-wrapper {
        padding-right: 0.3rem;
    }
    .difficulty-text {
        width: 10rem;
    }
    .percent-text {
        word-spacing: -0.2ch;
    }
    .currency-head {
        background: $body-background;
        border-bottom: 1px solid $border-color;
        border-left: 1px solid $border-color;
        border-right-width: 0 !important;
        border-top-width: 0 !important;
    }
</style>

{#if data}
    <CharacterTable characterLimit={hasEverySlot ? 1 : 0} skipGrouping={true} {filterFunc}>
        <CharacterTableHead slot="head">
            <svelte:fragment slot="headText">
                <div class="flex-wrapper">
                    <span class="difficulty-text">
                        {#if modifier === AppearanceModifier.LookingForRaid}
                            Looking For Raid
                        {:else}
                            {AppearanceModifier[modifier]}
                        {/if}
                    </span>
                    <span class="percent-text drop-shadow {getPercentClass(stats.percent)}">
                        {stats.percent.toFixed(0)} %
                    </span>
                </div>
            </svelte:fragment>

            {#each convertibleTypes as inventoryType}
                <th class="item-slot">
                    {InventoryType[inventoryType]}
                </th>
            {/each}

            <th class="currency-head" colspan="10"></th>
        </CharacterTableHead>

        <svelte:fragment slot="rowExtra" let:character>
            {#each convertibleTypes as inventoryType}
                <td class="item-slot">
                    {#if data[inventoryType].modifiers[modifier].userHas}
                        <IconifyIcon extraClass="status-success" icon={uiIcons.yes} />
                    {:else}
                        <CharacterItems
                            data={data[inventoryType].modifiers[modifier].characters[
                                character.id
                            ] || []}
                        />
                    {/if}
                </td>
            {/each}

            {#if season.conversionCurrencyId || (!hasEverySlot && (season.id === 3 || season.tiers[0].lowUpgrade))}
                <CharacterCurrencies {character} {season} tier={modifierToTier[modifier]} />
            {/if}
        </svelte:fragment>

        <tr slot="emptyRow">
            <td colspan={$commonColspan}></td>
            {#each convertibleTypes as inventoryType}
                <td class="item-slot">
                    {#if data[inventoryType].modifiers[modifier].userHas}
                        <IconifyIcon extraClass="status-success" icon={uiIcons.yes} />
                    {:else}
                        ---
                    {/if}
                </td>
            {/each}
        </tr>
    </CharacterTable>
{:else}
    <p>NO DATA</p>
{/if}
