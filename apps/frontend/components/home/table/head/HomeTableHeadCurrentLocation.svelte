<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { SortableProps } from '@/types/props';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
    td {
        @include cell-width($width-location, $maxWidth: $width-location-max);

        border-left: 1px solid var(--border-color);
    }
</style>

<td
    class="sortable sorted-{getSortState()}"
    onclick={() => setSortState()}
    use:basicTooltip={'Current Location'}
>
    Location
</td>
