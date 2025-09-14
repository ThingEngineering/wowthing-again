<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { SortableProps } from '@/types/props';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
    td {
        --max-width: var(--width-location-max);
        --width: var(--width-location);

        border-left: 1px solid var(--border-color);
    }
</style>

<td
    class="max-width sortable sorted-{getSortState()}"
    onclick={() => setSortState()}
    use:basicTooltip={'Current Location'}
>
    Location
</td>
