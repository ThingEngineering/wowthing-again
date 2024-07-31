<script lang="ts">
    import { lockoutState } from '@/stores/local-storage'
    import { staticStore } from '@/shared/stores/static'
    import { componentTooltip } from '@/shared/utils/tooltips'
    import type { Difficulty, InstanceDifficulty } from '@/types'
    import type { StaticDataInstance } from '@/shared/stores/static/types'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'
    import Tooltip from '@/components/tooltips/lockout-header/TooltipLockoutHeader.svelte'

    export let instanceDifficulty: InstanceDifficulty

    let difficulty: Difficulty
    let instance: StaticDataInstance
    let sortingBy: boolean

    $: {
        difficulty = instanceDifficulty.difficulty
        instance = $staticStore.instances[instanceDifficulty.instanceId]
    }

    $: {
        sortingBy = $lockoutState.sortBy === instanceDifficulty.instanceId
    }

    const onClick = function() {
        $lockoutState.sortBy = sortingBy ? 0 : instanceDifficulty.instanceId
    }
</script>

<style lang="scss">
    th {
        @include cell-width($width-lockout);

        border-left: 1px solid $border-color;
        padding: 0.6rem 0;
        text-align: center;
        white-space: nowrap;
    }
</style>

<th
    on:click|preventDefault={onClick}
    use:componentTooltip={{
        component: Tooltip,
        props: {
            difficulty,
            instanceId: instanceDifficulty.instanceId,
        },
    }}
>
    {instanceDifficulty.difficulty.shortName}-{instance?.shortName ?? instanceDifficulty.instanceId.toString()}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
