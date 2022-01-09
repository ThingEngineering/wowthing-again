<script lang="ts">
    import type { StaticDataProgressData, StaticDataProgressGroup } from '@/types'

    export let datas: StaticDataProgressData[]
    export let descriptionText: Record<number, string>
    export let group: StaticDataProgressGroup
    export let haveIndexes: number[]
</script>

<style lang="scss">
    .progress {
        vertical-align: top;
    }
    .name {
        padding-right: 1rem;
        text-align: left;

        span {
            color: #00ccff;
            display: block;
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{group.name}</h4>
    <table class="table-striped">
        <tbody>
            {#each datas as data, dataIndex}
                <tr>
                    <td class="progress">
                        {haveIndexes.indexOf(dataIndex) >= 0 ? '✔' : '❌'}
                    </td>
                    <td class="name">
                        {data.name}
                        {#if data.description && haveIndexes.indexOf(dataIndex) === -1}
                            <span class="drop-shadow">{descriptionText[dataIndex] || data.description}</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
