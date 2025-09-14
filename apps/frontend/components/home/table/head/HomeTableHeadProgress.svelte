<script lang="ts">
    import { activeViewProgress } from '@/user-home/state/activeViewProgress.svelte';
    import type { SortableProps } from '@/types/props';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    let { getSortState, setSortState }: SortableProps = $props();

    let activeProgress = $derived(activeViewProgress.value);
</script>

<style lang="scss">
    td {
        --width: 2rem;
    }
</style>

{#each activeProgress as [progressKey, , group] (progressKey)}
    <td
        class="sortable sorted-{getSortState(progressKey)}"
        data-progress={progressKey}
        data-tooltip={group.name}
        onclick={() => setSortState(progressKey)}
    >
        <WowthingImage name={group.icon} size={16} border={1} />
    </td>
{/each}
