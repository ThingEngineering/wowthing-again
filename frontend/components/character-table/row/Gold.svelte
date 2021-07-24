<script lang="ts">
    export let gold: number
</script>

<style lang="scss">
    td {
        @include cell-width($width-gold);

        text-align: right;
    }
</style>

<td>{gold.toLocaleString()} g</td>
