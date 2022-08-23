<script lang="ts">
    import { itemStore, staticStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import { getWowheadDomain } from '@/utils/get-wowhead-domain'
    import { tippyComponent } from '@/utils/tippy'
    import type { ItemDataItem } from '@/types/data/item'
    import type { StaticDataCurrency } from '@/types/data/static'

    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte'

    export let currency: StaticDataCurrency = undefined
    export let currencyId: number = undefined
    export let itemId: number = undefined

    let item: ItemDataItem
    let url: string
    $: {
        url = `https://${getWowheadDomain($settingsData.general.language)}.wowhead.com/`

        if (currencyId !== undefined) {
            currency = $staticStore.data.currencies[currencyId]
            item = undefined
        }
        else if (itemId !== undefined) {
            currency = undefined
            item = $itemStore.data.items[itemId]
        }
        
        if (currency) {
            url += `currency=${currency.id}`
        }
        else if (item) {
            url += `item=${item.id}`
        }
    }
</script>

<a
    href="{url}"
    on:click
    data-disable-wowhead-tooltip="true"
    use:tippyComponent={{
        component: Tooltip,
        props: {
            currency,
            item,
        }
    }}
>
    <slot />
</a>
