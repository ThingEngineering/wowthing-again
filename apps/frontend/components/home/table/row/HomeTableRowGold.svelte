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
        --max-width: 6rem;
        --width: 4rem;

        border-left: 1px solid var(--border-color);
        text-align: right;
    }
</style>

{#if showSortable}
    <td class="max-width sortable sorted-{getSortState()}" onclick={() => setSortState()}>
        {gold.toLocaleString()} g
    </td>
{:else}
    <td class="max-width">
        {gold.toLocaleString()} g
    </td>
{/if}
