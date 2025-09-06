<script lang="ts">
    import type { SortableProps } from '@/types/props';

    type Props = {
        gold: number;
        showSortable?: boolean;
    } & Partial<SortableProps>;

    let { gold, showSortable = false, getSortState, setSortState }: Props = $props();
</script>

<style lang="scss">
    td {
        @include cell-width($width-gold, $maxWidth: $width-gold-max);

        border-left: 1px solid var(--border-color);
        text-align: right;
    }
</style>

{#if showSortable}
    <td class="sortable sorted-{getSortState()}" onclick={() => setSortState()}>
        {gold.toLocaleString()} g
    </td>
{:else}
    <td>
        {gold.toLocaleString()} g
    </td>
{/if}
