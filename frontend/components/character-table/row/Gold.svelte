<script lang="ts">
    export let gold: number
</script>

<style lang="scss">
    td {
        padding-left: 0.1rem;
        padding-right: 0.7rem;
        text-align: right;
        width: 2rem;
    }
</style>

<td>{gold.toLocaleString()} g</td>
