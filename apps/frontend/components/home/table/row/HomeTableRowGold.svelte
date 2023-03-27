<script lang="ts">
    import { homeState } from '@/stores/local-storage'

    export let gold: number
    export let groupIndex = 0
    export let showSortable = false

    function setSorting(column: string) {
        const current = $homeState.groupSort[groupIndex]
        $homeState.groupSort[groupIndex] = current === column ? undefined : column
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-gold, $maxWidth: $width-gold-max);

        border-left: 1px solid $border-color;
        text-align: right;
    }
</style>

{#if showSortable}
    {@const field = 'gold'}
    <td
        class="sortable"
        class:sorted-by={$homeState.groupSort[groupIndex] === field}
        on:click={() => setSorting(field)}
        on:keypress={() => setSorting(field)}
    >
        {gold.toLocaleString()} g
    </td>
{:else}
    <td>
        {gold.toLocaleString()} g
    </td>
{/if}
