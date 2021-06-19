<script lang="ts">
    export let gold: number
</script>

<style lang="scss">
    td {
        text-align: right;
        width: 2rem;
    }
</style>

<td>{gold.toLocaleString()} g</td>
