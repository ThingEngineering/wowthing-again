<script lang="ts">
    import type { StaticDataProgressData, StaticDataProgressGroup } from '@/types'

    export let datas: StaticDataProgressData[]
    export let group: StaticDataProgressGroup
    export let have: number
</script>

<div class="wowthing-tooltip">
    <h4>{group.name}</h4>
    <table class="tooltip-progress table-striped">
        <tbody>
            {#each datas as data, dataIndex}
                <tr>
                    <td class="progress-progress">{have > dataIndex ? '✔' : '❌'}</td>
                    <td class="progress-name">
                        {data.name}
                        {#if data.description && have <= dataIndex}
                            <span>{data.description}</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
