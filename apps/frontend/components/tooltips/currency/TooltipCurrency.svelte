<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import { getCharacterNameRealm } from '@/utils/get-character-name-realm';
    import { leftPad } from '@/utils/formatting';
    import type { Character } from '@/types';
    import type { ItemDataItem } from '@/types/data/item';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';

    import CharacterTag from '@/user-home/components/character/CharacterTag.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        currency?: StaticDataCurrency;
        item?: ItemDataItem;
        itemId?: number;
    };
    let { currency, item, itemId }: Props = $props();

    let [currencyName, iconName] = $derived.by(() => {
        if (currency) {
            return [currency.name, currency.imageName];
        } else if (item) {
            return [item.name, item.imageName];
        } else if (itemId) {
            const itemFromId = wowthingData.items.items[itemId];
            return [itemFromId?.name || `Item #${itemId}`, item?.imageName];
        } else {
            return ['Gold', 'currency/0'];
        }
    });

    let description = $derived.by(() => {
        if (currency?.description) {
            return currency.description.replaceAll('\r\n', '<br>');
        }
    });

    let currencies = $derived.by(() => {
        let ret: [Character, number][] = [];
        for (const character of userState.general.activeCharacters) {
            let quantity = 0;
            if (currency) {
                quantity = character.currencies?.[currency.id]?.quantity || 0;
            } else if (item) {
                quantity = character.getItemCount(item.id);
            } else if (itemId) {
                quantity = character.getItemCount(itemId);
            } else {
                quantity = character.gold || 0;
            }

            if (quantity > 0) {
                ret.push([character, quantity]);
            }
        }

        ret = sortBy(ret, ([, amount]) => leftPad(10_000_000 - amount, 8, '0'));

        if (item || itemId) {
            const warbankItems = userState.general.warbankItemsByItemId[item?.id || itemId] || [];
            const quantity = warbankItems.reduce((a, b) => a + b.count, 0);
            if (quantity > 0) {
                ret.unshift([null, quantity]);
            }
        }

        return ret;
    });
</script>

<style lang="scss">
    .wowthing-tooltip {
        --image-border-width: 1px;

        width: 22rem;
    }
    .description {
        margin-bottom: 0.5rem;
        padding: 0 0.5rem;
        text-align: left;

        & + table {
            border-top: 1px solid var(--border-color);
        }
    }
    table {
        --padding: 2;

        table-layout: auto;
    }
    .name {
        text-align: left;
        width: auto;
    }
    .amount {
        --max-width: 4rem;
        --width: 2rem;

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

    <table class="table table-striped">
        <tbody>
            {#if currencies.length > 0}
                {#each currencies.slice(0, 10) as [character, amount] (character)}
                    <tr>
                        <CharacterTag {character} />
                        <td class="name text-overflow">
                            {#if character}
                                {getCharacterNameRealm(character.id)}
                            {:else}
                                Account Bank
                            {/if}
                        </td>
                        <td class="amount max-width">{amount.toLocaleString()}</td>
                    </tr>
                {/each}

                {#if currencies.length > 10}
                    <tr>
                        <td colspan="3">... and {currencies.length - 10} more</td>
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
