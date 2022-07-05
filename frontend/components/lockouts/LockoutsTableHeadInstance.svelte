<script lang="ts">
    import { lockoutState } from '@/stores/local-storage'
    import { staticStore } from '@/stores/static'
    import tippy from '@/utils/tippy'
    import type {InstanceDifficulty,} from '@/types'

    import TableSortedBy from '@/components/common/TableSortedBy.svelte'

    export let instanceDifficulty: InstanceDifficulty

    let instanceName: string
    let sortingBy: boolean
    let tooltip: string

    $: {
        const difficulty = instanceDifficulty.difficulty
        const instance = $staticStore.data.instances[instanceDifficulty.instanceId]

        if (instance) {
            instanceName = instance.shortName
            tooltip = `${instance.name}`
        }
        else {
            instanceName = instanceDifficulty.instanceId.toString()
            tooltip = `Unknown instance #${instanceName}`
        }
        tooltip += `<br><span class="quality2">${difficulty.name}</span>`
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
    use:tippy={{
        allowHTML: true,
        content: tooltip,
    }}
>
    {instanceDifficulty.difficulty.shortName}-{instanceName}

    {#if sortingBy}
        <TableSortedBy />
    {/if}
</th>
