<script lang="ts">
    import { iconLibrary } from '@/shared/icons';
    import type { SortableProps } from '@/types/props';

    import IconifyWrapper from '@/shared/components/images/IconifyWrapper.svelte';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
</style>

<td
    class="sortable sorted-{getSortState()}"
    onclick={() => setSortState()}
    data-tooltip="Free Bag Slots"
>
    <IconifyWrapper icon={iconLibrary.gameBackpack} scale="0.9" />
</td>
