<script lang="ts">
    import { singleLockoutRaids } from '@/data/raid';
    import { wowthingData } from '@/shared/stores/data';
    import { lockoutState } from '@/stores/local-storage';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { StaticDataInstance } from '@/shared/stores/static/types';
    import type { Difficulty, InstanceDifficulty } from '@/types';

    import TableSortedBy from '@/components/common/TableSortedBy.svelte';
    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte';

    let { instanceDifficulty }: { instanceDifficulty: InstanceDifficulty } = $props();

    let difficulty: Difficulty = instanceDifficulty.difficulty;
    let instance: StaticDataInstance = wowthingData.static.instanceById.get(
        instanceDifficulty.instanceId
    );

    let sortingBy = $derived($lockoutState.sortBy === instanceDifficulty.instanceId);

    const onClick = function () {
        $lockoutState.sortBy = sortingBy ? 0 : instanceDifficulty.instanceId;
    };
</script>

<style lang="scss">
    th {
        @include cell-width($width-lockout);

        border-left: 1px solid var(--border-color);
        padding: 0.3rem 0;
        text-align: center;
        white-space: nowrap;
    }
</style>

<th
    data-difficulty={instanceDifficulty?.difficulty}
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
    {#if singleLockoutRaids.has(instanceDifficulty.instanceId)}
        {instance?.shortName ?? instanceDifficulty.instanceId.toString()}
    {:else}
        {instanceDifficulty.difficulty.shortName}-{instance?.shortName ??
            instanceDifficulty.instanceId.toString()}
    {/if}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
