<script lang="ts">
    import { homeState } from '@/stores/local-storage';
    import { basicTooltip } from '@/shared/utils/tooltips';

    let { sortKey }: { sortKey: string } = $props();

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }

    const sortField = 'locationCurrent';
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid var(--border-color);
    }
</style>

<td
    class="sortable"
    class:sorted-by={$homeState.groupSort[sortKey] === sortField}
    onclick={() => setSorting(sortField)}
    onkeypress={() => setSorting(sortField)}
    use:basicTooltip={'Current Location'}
>
    Location
</td>
