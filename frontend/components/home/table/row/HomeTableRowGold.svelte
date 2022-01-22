<script lang="ts">
    export let gold: number
</script>

<style lang="scss">
    td {
        @include cell-width($width-gold, $maxWidth: $width-gold-max);

        text-align: right;
    }
</style>

<td>{gold.toLocaleString()} g</td>
