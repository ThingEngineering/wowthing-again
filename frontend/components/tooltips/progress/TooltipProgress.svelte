<script lang="ts">
    import some from 'lodash/some'

    import type { Character } from '@/types'
    import type { StaticDataProgressData, StaticDataProgressGroup } from '@/types/data/static'
import data from '@iconify/icons-mdi/arrow-down-bold-outline';

    export let character: Character
    export let datas: StaticDataProgressData[]
    export let descriptionText: Record<number, string>
    export let group: StaticDataProgressGroup
    export let haveIndexes: number[]

    let useSpan: boolean
    $: {
        useSpan = !some(datas, (data, i) => {
            const desc = descriptionText[i] || data.description
            if (desc && desc.length > 20) {
                return true
            }
        })
    }
</script>

<style lang="scss">
    .progress {
        vertical-align: top;
    }
    .name {
        padding-right: 1rem;
        text-align: left;

        p {
            color: #00ccff;
            margin-top: 0;
        }
        span {
            color: #00ccff;
            white-space: nowrap; 
        }
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>{group.name}</h5>
    <table class="table-striped">
        <tbody>
            {#each datas as data, dataIndex}
                {@const description = descriptionText[dataIndex] || data.description}
                <tr>
                    <td class="progress">
                        {haveIndexes.indexOf(dataIndex) >= 0 ? '✔' : '❌'}
                    </td>
                    <td class="name">
                        {data.name}
                        {#if description && haveIndexes.indexOf(dataIndex) === -1}
                            {#if useSpan}
                                <span class="drop-shadow">&ndash; {description}</span>
                            {:else}
                                <p class="drop-shadow">{description}</p>
                            {/if}
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
