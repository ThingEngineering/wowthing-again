<script lang="ts">
    import { imageStrings } from '@/data/icons';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { SortableProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

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
    use:basicTooltip={'Hearth Location'}
>
    <WowthingImage name={imageStrings.hearthstone} size={20} border={1} />
</td>
