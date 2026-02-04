<script lang="ts">
    import { currencyIconOverride, currencyText } from '@/data/currencies';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { currencyState } from '@/stores/local-storage';
    import type { StaticDataCurrency } from '@/shared/stores/static/types';

    import TableSortedBy from '@/components/common/TableSortedBy.svelte';
    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        currency?: StaticDataCurrency;
        itemId?: number;
        slug: string;
        sortingBy: boolean;
    };
    let { currency, itemId, slug, sortingBy }: Props = $props();

    let cls = $derived(
        itemId ? `quality${wowthingData.items.items[itemId]?.quality || 1}` : 'quality1'
    );
    let text = $derived(currencyText[itemId ? 1_000_000 + itemId : currency.id]);

    let onClick = $derived((event: Event) => {
        event.preventDefault();
        $currencyState.sortOrder[slug] = sortingBy ? 0 : itemId || currency.id;
    });
</script>

<style lang="scss">
    th {
        --image-border-width: 2px;
        --padding: 0.2rem;
        --padding-left: 0;
        --padding-right: 0;
        --width: var(--width-currency);
        --width-max: var(--width-currency-max);

        background: var(--color-thing-background);
        border: 1px solid var(--border-color);
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: var(--padding);
        padding-top: var(--padding);
        text-align: center;

        :global(a) {
            display: block;
            position: relative;
        }
    }
    .text {
        bottom: 0;
    }
</style>

<th
    class="width-max {cls}"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            currency,
            item: wowthingData.items.items[itemId],
            itemId,
        },
    }}
>
    <WowheadLink
        on:click={onClick}
        type={itemId ? 'item' : 'currency'}
        id={itemId || currency.id}
        noTooltip={true}
    >
        <WowthingImage
            name={currencyIconOverride[itemId || currency.id] ||
                (itemId ? `item/${itemId}` : `currency/${currency.id}`)}
            size={40}
            border={2}
        />

        {#if text}
            <span class="text quality1 abs-center pill">{text}</span>
        {/if}

        {#if sortingBy}
            <TableSortedBy />
        {/if}
    </WowheadLink>
</th>
