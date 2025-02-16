<script lang="ts">
    import { lockoutState } from '@/stores/local-storage'
    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Difficulty, InstanceDifficulty } from '@/types'
    import type { StaticDataInstance } from '@/shared/stores/static/types'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte'
    import { singleLockoutRaids } from '@/data/raid';

    export let instanceDifficulty: InstanceDifficulty

    let difficulty: Difficulty
    let instance: StaticDataInstance
    $: {
        difficulty = instanceDifficulty.difficulty
        instance = $staticStore.instances[instanceDifficulty.instanceId]
    }

    $: sortingBy = $lockoutState.sortBy === instanceDifficulty.instanceId

    const onClick = function() {
        $lockoutState.sortBy = sortingBy ? 0 : instanceDifficulty.instanceId
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-lockout);

        border-left: 1px solid $border-color;
        padding: 0.3rem 0;
        text-align: center;
        white-space: nowrap;
    }
</style>

<th
    data-difficulty={instanceDifficulty?.difficulty}
    data-instance={instanceDifficulty?.instanceId}
    on:click|preventDefault={onClick}
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
        {instanceDifficulty.difficulty.shortName}-{instance?.shortName ?? instanceDifficulty.instanceId.toString()}
    {/if}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
