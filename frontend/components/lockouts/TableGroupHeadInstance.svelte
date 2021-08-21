<script lang="ts">
    import {extraInstanceMap} from '@/data/dungeon'
    import { staticStore } from '@/stores/static'
    import type {InstanceDifficulty,} from '@/types'
    import tippy from '@/utils/tippy'

    export let instanceDifficulty: InstanceDifficulty

    let instanceName: string
    let tooltip: string

    $: {
        const difficulty = instanceDifficulty.difficulty
        const instance = $staticStore.data.instances[instanceDifficulty.instanceId] || extraInstanceMap[instanceDifficulty.instanceId]

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
        @include cell-width($width-lockout);

        text-align: center;
    }
</style>

<td use:tippy={{content: tooltip, allowHTML: true}}>
    {instanceDifficulty.difficulty.shortName}-{instanceName}
</td>
