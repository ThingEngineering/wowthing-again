<script lang="ts">
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
    data-tooltip="Current Location"
    onclick={() => setSortState()}
>
    Location
</td>
