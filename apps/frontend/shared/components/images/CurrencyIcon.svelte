<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';

    import WowthingImage from './sources/WowthingImage.svelte';

    type Props = {
        currencyId: number;
        border?: number;
        size?: number;
        useTooltip?: boolean;
    };
    let { currencyId, border = 1, size = 20, useTooltip }: Props = $props();

    let currency = $derived(
        currencyId < 1_000_000 ? wowthingData.static.currencyById.get(currencyId) : null
    );
    let item = $derived(
        currencyId > 1_000_000 ? wowthingData.items.items[currencyId - 1_000_000] : null
    );

    let tooltip = $derived(useTooltip ? currency?.name || item?.name : undefined);
</script>

<WowthingImage
    name={currency ? `currency/${currency.id}` : `item/${item.id}`}
    {border}
    {size}
    {tooltip}
/>
