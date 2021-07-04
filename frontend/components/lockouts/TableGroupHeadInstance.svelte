<script lang="ts">
    import {data as staticData} from '@/stores/static'
    import type {InstanceDifficulty,} from '@/types'
    import tippy from '@/utils/tippy'

    export let instanceDifficulty: InstanceDifficulty

    let instanceName: string
    let tooltip: string

    $: {
        const difficulty = instanceDifficulty.difficulty
        const instance = $staticData.instances[instanceDifficulty.instanceId]

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
</script>

<style lang="scss">
    td {
        text-align: center;
    }
</style>

<td use:tippy={{content: tooltip, allowHTML: true}}>
    {instanceDifficulty.difficulty.shortName}-{instanceName}
</td>
