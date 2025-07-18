<script lang="ts">
    import sortBy from 'lodash/sortBy';
    import uniqBy from 'lodash/uniqBy';

    import {
        categoryChildren,
        categoryOrder,
        currencyExtra,
        currencyItems,
        skipCurrenciesMap,
    } from '@/data/currencies';
    import { wowthingData } from '@/shared/stores/data';
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types';

    import MagicLists from '../../MagicLists.svelte';
    import TextInput from '@/shared/components/forms/TextInput.svelte';

    let { active, view = $bindable() }: { active: boolean; view: SettingsView } = $props();

    const categoryPrefix: Record<number, string> = {
        260: '[TWW]', // The War Within
        250: '[DF]', // Dragonflight
        245: '[SL]', // Shadowlands
        143: '[BfA]', // Battle for Azeroth
        141: '[Leg]', // Legion
        137: '[WoD]', // Warlords of Draenor
        133: '[MoP]', // Mists of Pandaria
        81: '[Cata]', // Cataclysm
        21: '[Wrath]', // Wrath of the Lich King
        23: '[TBC]', // Burning Crusade
        22: '[Dun]', // Dungeon and Raid
        1: '[Misc]', // Miscellaneous
        2: '[PvP]', // Player vs. Player
    };

    let currencyFilter = $state('');

    let currencyChoices = $derived.by(() => {
        const ret: SettingsChoice[] = [];
        for (const categoryId of categoryOrder) {
            if (categoryPrefix[categoryId] === undefined) {
                continue;
            }

            const categoryIds: number[] = [categoryId];
            if (categoryChildren[categoryId]) {
                // Hacky, ugh
                categoryIds.push(
                    ...categoryChildren[categoryId]
                        .map((c) => c.id)
                        .filter((c) => [125001, 125011, 125012].indexOf(c) === -1)
                );
            }

            const currencies: SettingsChoice[] = [];
            for (const currency of wowthingData.static.currencyById.values()) {
                if (
                    skipCurrenciesMap[currency.id] ||
                    categoryIds.indexOf(currency.categoryId) === -1
                ) {
                    continue;
                }

                currencies.push({
                    id: currency.id.toString(),
                    name: currency.name,
                });
            }

            for (const actualCategoryId of categoryIds) {
                for (const currencyId of currencyExtra[actualCategoryId] || []) {
                    const currency = wowthingData.static.currencyById.get(currencyId);
                    if (currency) {
                        currencies.push({
                            id: currency.id.toString(),
                            name: currency.name,
                        });
                    }
                }

                for (const itemId of currencyItems[actualCategoryId] || []) {
                    const item = wowthingData.items.items[itemId];
                    if (item) {
                        currencies.push({
                            id: (itemId + 1000000).toString(),
                            name: item.name,
                        });
                    }
                }
            }

            for (const currency of currencies) {
                currency.name = `${categoryPrefix[categoryId]} ${currency.name}`;
            }

            ret.push(...sortBy(currencies, (currency) => currency.name));
        }

        return uniqBy(ret, (c) => c.id);
    });
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
</style>

{#if active}
    <div class="settings-block">
        <h3>Currencies</h3>

        <div class="magic-filter">
            <TextInput
                name="currencies_filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={currencyFilter}
            />
        </div>

        <MagicLists
            key="currencies"
            choices={currencyChoices}
            filter={currencyFilter}
            bind:activeNumberIds={view.homeCurrencies}
        />
    </div>
{/if}
