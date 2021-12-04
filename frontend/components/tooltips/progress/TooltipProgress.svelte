<script lang="ts">
    import type { StaticDataProgressData, StaticDataProgressGroup } from '@/types'

    export let datas: StaticDataProgressData[]
    export let group: StaticDataProgressGroup
    export let haveIndexes: number[]
</script>

<div class="wowthing-tooltip">
    <h4>{group.name}</h4>
    <table class="tooltip-progress table-striped">
        <tbody>
            {#each datas as data, dataIndex}
                <tr>
                    <td class="progress-progress">
                        {haveIndexes.indexOf(dataIndex) >= 0 ? '✔' : '❌'}
                    </td>
                    <td class="progress-name">
                        {data.name}
                        {#if data.description && haveIndexes.indexOf(dataIndex) === -1}
                            <span>{data.description}</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
