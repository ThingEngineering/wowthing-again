<script lang="ts">
    // import { componentTooltip } from '@/shared/utils/tooltips';
    import { homeState } from '@/stores/local-storage';
    import { activeViewProgress } from '@/user-home/state/activeViewProgress.svelte';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import { basicTooltip } from '@/shared/utils/tooltips';

    let { sortKey }: { sortKey: string } = $props();

    let activeProgress = $derived(activeViewProgress.value);

    function setSorting(column: string) {
        const current = $homeState.groupSort[sortKey];
        $homeState.groupSort[sortKey] = current === column ? undefined : column;
    }
</script>

<style lang="scss">
    td {
        --width: 2rem;
    }
</style>

{#each activeProgress as [progressKey, , group] (progressKey)}
    {@const sortField = `progress:${progressKey}`}
    <td
        class="sized b-l sortable"
        class:sorted-by={$homeState.groupSort[sortKey] === sortField}
        data-progress={progressKey}
        onclick={() => setSorting(sortField)}
        onkeypress={() => setSorting(sortField)}
        use:basicTooltip={group.name}
    >
        <WowthingImage name={group.icon} size={16} border={1} />
    </td>
{/each}
