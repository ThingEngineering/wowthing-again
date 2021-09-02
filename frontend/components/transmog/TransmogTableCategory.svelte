<script lang="ts">
    import {transmogSets} from '@/data/transmog-sets'
    import type {Dictionary} from '@/types'
    import type {TransmogDataCategory} from '@/types/data'
    import getTransmogSpan from '@/utils/get-transmog-span'

    import TransmogTableSet from './TransmogTableSet.svelte'

    export let category: TransmogDataCategory
    export let setKey: string
    export let skipClasses: Dictionary<boolean>

    console.log(category)
</script>

<style lang="scss">
    .faded {
        opacity: 0.4;
    }
    .name {
        min-width: 10.5rem;
        padding: 0 1.5rem 0 0.5rem;
    }
    .highlight {
        background-color: $highlight-background;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
    }
    .tag {
        color: $colour-success;
    }
</style>

{#each category.groups as group, groupIndex}
    {#if groupIndex === 0 || category.groups[groupIndex-1].name !== group.name}
        <tr>
            <td class="name highlight" colspan="13">
                {#if group.tag}<span class="tag">[{group.tag}]</span>{/if}
                {group.name}
            </td>
        </tr>
    {/if}
    {#each group.sets as setName, setIndex}
        <tr class:faded={setName.endsWith('*')}>
            <td class="name">&ndash {setName.replace('*', '')}</td>

            {#each transmogSets[group.type] as transmogSet (`set--${setKey}--${setName}--${transmogSet.type}`)}
                {#if !skipClasses[transmogSet.type]}
                    <TransmogTableSet
                        set={group.data?.[transmogSet.type]?.[setIndex]}
                        span={getTransmogSpan(group, transmogSet, skipClasses)}
                        subType={transmogSet.subType}
                    />
                {/if}
            {/each}
        </tr>
    {/each}
{/each}
