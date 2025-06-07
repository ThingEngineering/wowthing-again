<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { staticStore } from '@/shared/stores/static';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { ItemDataItem } from '@/types/data/item';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';

    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte';

    export let currency: StaticDataCurrency = undefined;
    export let currencyId: number = undefined;
    export let itemId: number = undefined;

    let item: ItemDataItem;
    let url: string;
    $: {
        url = `https://${settingsState.wowheadBaseUrl}/`;

        if (currencyId !== undefined) {
            currency = $staticStore.currencies[currencyId];
            item = undefined;
        } else if (itemId !== undefined) {
            currency = undefined;
            item = wowthingData.items.items[itemId];
        }

        if (currency) {
            url += `currency=${currency.id}`;
        } else if (item) {
            url += `item=${item.id}`;
        }
    }
</script>

<a
    href={url}
    on:click
    data-disable-wowhead-tooltip="true"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            currency,
            item,
        },
    }}
>
    <slot />
</a>
