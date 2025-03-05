<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { userStore } from '@/stores';
    import { settingsStore } from '@/shared/stores/settings';
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm';
    import { getFilteredCharacters } from '@/utils/get-filtered-characters';
    import { leftPad } from '@/utils/formatting';
    import type { Character } from '@/types';
    import type { ItemDataItem } from '@/types/data/item';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let currency: StaticDataCurrency = undefined;
    export let item: ItemDataItem = undefined;
    export let itemId: number = undefined;

    let currencies: [Character, number][];
    let currencyName: string;
    let description: string;
    let iconName: string;
    $: {
        currencies = [];
        for (const character of getFilteredCharacters($settingsStore, $userStore)) {
            let quantity = 0;
            if (currency) {
                currencyName = currency.name;
                iconName = `currency/${currency.id}`;
                quantity = character.currencies?.[currency.id]?.quantity || 0;
            } else if (item) {
                currencyName = item.name;
                iconName = `item/${item.id}`;
                quantity = character.getItemCount(item.id);
            } else if (itemId) {
                currencyName = `Item #${itemId}`;
                iconName = `item/${itemId}`;
                quantity = character.getItemCount(itemId);
            } else {
                currencyName = 'Gold';
                iconName = 'currency/0';
                quantity = character.gold || 0;
            }

            if (quantity > 0) {
                currencies.push([character, quantity]);
            }
        }

        currencies = sortBy(currencies, ([, amount]) => leftPad(10_000_000 - amount, 8, '0'));

        if (item || itemId) {
            const warbankItems = $userStore.warbankItemsByItemId[item?.id || itemId] || [];
            const quantity = warbankItems.reduce((a, b) => a + b.count, 0);
            if (quantity > 0) {
                currencies.unshift([null, quantity]);
            }
        }

        if (currency?.description) {
            description = currency.description.replaceAll('\r\n', '<br>');
        }
    }
</script>

<style lang="scss">
    .wowthing-tooltip {
        --image-border-width: 1px;

        max-width: 22rem;
    }
    .description {
        margin-bottom: 0.5rem;
        padding: 0 0.5rem;
        text-align: left;

        & + table {
            border-top: 1px solid #{$border-color};
        }
    }
    table {
        --padding: 2;
    }
    .name {
        @include cell-width(3rem, $maxWidth: 10rem);

        text-align: left;
        white-space: nowrap;
    }
    .amount {
        @include cell-width(4rem);

        text-align: right;
        white-space: nowrap;
    }
</style>

<div class="wowthing-tooltip">
    <h4>
        <WowthingImage name={iconName} size={20} border={1} />
        {currencyName}
    </h4>

    {#if description}
        <p class="description">{@html description}</p>
    {/if}

    <table class="table-striped">
        <tbody>
            {#if currencies.length > 0}
                {#each currencies.slice(0, 10) as [character, amount]}
                    <tr>
                        <td class="name">
                            {#if character}
                                {getCharacterNameRealm(character.id)}
                            {:else}
                                Account Bank
                            {/if}
                        </td>
                        <td class="amount">{amount.toLocaleString()}</td>
                    </tr>
                {/each}

                {#if currencies.length > 10}
                    <tr>
                        <td colspan="2">... and {currencies.length - 10} more</td>
                    </tr>
                {/if}
            {:else}
                <tr>
                    <td>No character has this currency!</td>
                </tr>
            {/if}
        </tbody>
    </table>

    {#if currencies.length > 0}
        <div class="bottom">
            Total:
            <WowthingImage name={iconName} size={20} border={1} />
            {currencies.reduce((a, b) => a + b[1], 0).toLocaleString()}
        </div>
    {/if}
</div>
