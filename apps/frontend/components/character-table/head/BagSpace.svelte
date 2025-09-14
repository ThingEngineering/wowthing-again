<script lang="ts">
    import { iconLibrary } from '@/shared/icons';
    import type { SortableProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';

    let { getSortState, setSortState }: SortableProps = $props();
</script>

<style lang="scss">
</style>

<td
    class="sortable sorted-{getSortState()}"
    onclick={() => setSortState()}
    data-tooltip="Free Bag Slots"
>
    <IconifyIcon icon={iconLibrary.gameBackpack} scale="0.9" />
</td>
