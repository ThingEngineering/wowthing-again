<script lang="ts">
    import type {StaticDataCurrency} from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import CurrencyLink from '@/components/links/CurrencyLink.svelte'

    export let currency: StaticDataCurrency
</script>

<style lang="scss">
    th {
        @include cell-width($width-currency);

        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding-bottom: $width-padding;
        padding-top: $width-padding;
        text-align: center;

        & :global(img) {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
    }
</style>

<th>
    <CurrencyLink id={currency.id}>
        <WowthingImage name="currency/{currency.id}" size={48} border={1} />
    </CurrencyLink>
</th>
