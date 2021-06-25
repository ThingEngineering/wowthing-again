<script lang="ts">
    import type {StaticDataCurrency} from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let currency: StaticDataCurrency
</script>

<style lang="scss">
    th {
        background: $thing-background;
        border: 1px solid $border-color;
        border-right-width: 0;
        border-top-width: 0;
        padding: 0.3rem 0;
        text-align: center;
        width: 4em;

        & :global(img) {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
    }
</style>

<th>
    <a href="currencies/{currency.id}">
        <WowthingImage name="currency/{currency.id}" size={48} border={1} tooltip={currency.name} />
    </a>
</th>
