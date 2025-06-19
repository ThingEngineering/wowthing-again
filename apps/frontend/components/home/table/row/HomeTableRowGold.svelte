<script lang="ts">
    import { homeState } from '@/stores/local-storage';

    type Props = { gold: number; showSortable?: boolean; sortKey?: string };

    let { gold, showSortable = false, sortKey = undefined }: Props = $props();

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
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
        class:sorted-by={$homeState.groupSort[sortKey] === field}
        onclick={() => setSorting(field)}
        onkeypress={() => setSorting(field)}
    >
        {gold.toLocaleString()} g
    </td>
{:else}
    <td>
        {gold.toLocaleString()} g
    </td>
{/if}
