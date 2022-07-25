<script lang="ts">
    import { currencyState } from '@/stores/local-storage'
    import type { StaticDataCurrency } from '@/types/data/static'

    import CurrencyLink from '@/components/links/CurrencyLink.svelte'
    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let currency: StaticDataCurrency
    export let slug: string
    export let sortingBy: boolean

    let onClick: (event: Event) => void
    $: {
        onClick = function(event: Event) {
            event.preventDefault()
            $currencyState.sortOrder[slug] = sortingBy ? 0 : currency.id
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

<th>
    <CurrencyLink
        on:click={onClick}
        {currency}
    >
        <WowthingImage
            name="currency/{currency.id}"
            size={40}
            border={2}
        />

        {#if sortingBy}
            <TableSortedBy />
        {/if}
    </CurrencyLink>
</th>
