<script lang="ts">
    import { singleLockoutRaids } from '@/data/raid';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { InstanceDifficulty } from '@/types';

    import TableSortedBy from '@/components/common/TableSortedBy.svelte';
    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte';

    type Props = {
        instanceDifficulty: InstanceDifficulty;
        striped?: boolean;
    }
    let { instanceDifficulty, striped = false }: Props = $props();

    let difficulty = $derived(instanceDifficulty.difficulty);
    let instance = $derived(wowthingData.static.instanceById.get(instanceDifficulty.instanceId));

    let sortingBy = $derived(
        browserState.current.lockouts.sortBy === instanceDifficulty.instanceId
    );

    const onClick = function () {
        browserState.current.lockouts.sortBy = sortingBy ? 0 : instanceDifficulty.instanceId;
    };
</script>

<style lang="scss">
    th {
        border-left: 1px solid var(--border-color);
        padding: 0.2rem 0.3rem;
        text-align: center;
        white-space: nowrap;
    }
</style>

<th
    class:alt={striped}
    data-difficulty={instanceDifficulty?.difficulty?.id}
    data-instance={instanceDifficulty?.instanceId}
    onclick={onClick}
    use:componentTooltip={{
        component: Tooltip,
        props: {
            difficulty,
            instanceId: instanceDifficulty.instanceId,
        },
    }}
>
    {#if singleLockoutRaids.has(instanceDifficulty.instanceId) && ![7, 17].includes(difficulty.id)}
        {#if browserState.current.lockouts.grouped}
            All
        {:else}
            {instance?.shortName ?? instanceDifficulty.instanceId.toString()}
        {/if}
    {:else if browserState.current.lockouts.grouped}
        {instanceDifficulty.difficulty.shortName}
    {:else}
        {instanceDifficulty.difficulty.shortName}-{instance?.shortName ??
            instanceDifficulty.instanceId.toString()}
    {/if}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
