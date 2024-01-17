<script lang="ts">
    import debounce from 'lodash/debounce'
    import uniqBy from 'lodash/uniqBy'
    import sortBy from 'lodash/sortBy'

    import { categoryChildren, categoryOrder, currencyExtra, currencyItems, skipCurrenciesMap } from '@/data/currencies'
    import { staticStore } from '@/shared/stores/static'
    import { itemStore } from '@/stores'
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let active: boolean
    export let view: SettingsView

    let currencyFilter: string

    const categoryPrefix: Record<number, string> = {
        250: '[DF]',
        245: '[SL]',
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
    }

    let currencyChoices: SettingsChoice[]
    $: {
        currencyChoices = []
        for (const categoryId of categoryOrder) {
            if (categoryPrefix[categoryId] === undefined) { continue }
            
            const categoryIds: number[] = [categoryId]
            if (categoryChildren[categoryId]) {
                // Hacky, ugh
                categoryIds.push(...categoryChildren[categoryId]
                    .map((c) => c.id)
                    .filter((c) => [125001, 125011, 125012].indexOf(c) === -1)
                )
            }

            const currencies: SettingsChoice[] = []
            for (const currency of Object.values($staticStore.currencies)) {
                if (skipCurrenciesMap[currency.id] || categoryIds.indexOf(currency.categoryId) === -1) {
                    continue
                }

                currencies.push({
                    key: currency.id.toString(),
                    name: currency.name,
                })
            }
            
            for (const actualCategoryId of categoryIds) {
                for (const currencyId of (currencyExtra[actualCategoryId] || [])) {
                    const currency = $staticStore.currencies[currencyId]
                    if (currency) {
                        currencies.push({
                            key: currency.id.toString(),
                            name: currency.name,
                        })
                    }
                }

                for (const itemId of (currencyItems[actualCategoryId] || [])) {
                    const item = $itemStore.items[itemId]
                    if (item) {
                        currencies.push({
                            key: (itemId + 1000000).toString(),
                            name: item.name,
                        })
                    }
                }
            }

            for (const currency of currencies) {
                currency.name = `${categoryPrefix[categoryId]} ${currency.name}`
            }

            currencyChoices.push(...sortBy(
                currencies,
                (currency) => currency.name
            ))
        }

        currencyChoices = uniqBy(currencyChoices, (c) => c.key)
    }

    $: currencyActive = view.homeCurrencies
        .map((f) => currencyChoices.filter((c) => parseInt(c.key) === f)[0])
        .filter(f => f !== undefined)
    
    $: currencyInactive = currencyChoices.filter(
        (instance) => currencyActive.indexOf(instance) === -1 &&
            (
                !currencyFilter ||
                instance.name.toLocaleLowerCase().indexOf(currencyFilter.toLocaleLowerCase()) >= 0
            )
    )

    const onCurrenciesChange = debounce(() => {
        view.homeCurrencies = currencyActive.map((c) => parseInt(c.key))
    }, 100)
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 17rem;
        --magic-max-height: 17rem;
    }
    .filter-currencies {
        position: relative;

        :global(fieldset) {
            background: $highlight-background;
            bottom: -2.6rem;
            position: absolute;
            right: -4px;
            width: 12rem;
        }
    }
</style>

<div class="settings-block">
    <h3>
        Currencies
        {#if !active}
            <span>add to Home columns to configure</span>
        {/if}
    </h3>

    {#if active}
        <div class="filter-currencies">
            <TextInput
                name="filter"
                maxlength={20}
                placeholder="Search..."
                bind:value={currencyFilter}
            />
        </div>

        <MagicLists
            key="currencies"
            title="Currencies"
            onFunc={onCurrenciesChange}
            active={currencyActive}
            inactive={currencyInactive}
        />
    {/if}
</div>
