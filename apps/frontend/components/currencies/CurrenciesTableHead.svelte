<script lang="ts">
    import { itemStore } from '@/stores'
    import { currencyState } from '@/stores/local-storage'
    import { tippyComponent } from '@/utils/tippy'
    import type { StaticDataCurrency } from '@/types/data/static'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import Tooltip from '@/components/tooltips/currency/TooltipCurrency.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let currency: StaticDataCurrency = undefined
    export let itemId = 0
    export let slug: string
    export let sortingBy: boolean

    let onClick: (event: Event) => void
    $: {
        onClick = function(event: Event) {
            event.preventDefault()
            $currencyState.sortOrder[slug] = sortingBy ? 0 : (itemId || currency.id)
        }
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-currency);

        --image-border-color: #{lighten($border-color, 20%)};
        --image-border-width: 2px;

        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: $width-padding;
        padding-top: $width-padding;
        position: relative;
        text-align: center;
    }
</style>

<th
    use:tippyComponent={{
        component: Tooltip,
        props: {
            currency,
            item: $itemStore.data.items[itemId],
        }
    }}
>
    <WowheadLink
        on:click={onClick}
        type={itemId ? 'item' : 'currency'}
        id={itemId || currency.id}
        noTooltip={true}
    >
        <WowthingImage
            name={itemId ? `item/${itemId}` : `currency/${currency.id}`}
            size={40}
            border={2}
        />

        {#if sortingBy}
            <TableSortedBy />
        {/if}
    </WowheadLink>
</th>
