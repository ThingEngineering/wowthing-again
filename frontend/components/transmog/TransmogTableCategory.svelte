<script lang="ts">
    import {transmogSets} from '@/data/transmog-sets'
    import type {TransmogDataCategory} from '@/types/data'

    import TransmogTableSet from './TransmogTableSet.svelte'

    export let category: TransmogDataCategory
    export let setKey: string
</script>

<style lang="scss">
    .name {
        padding: 0 1.5rem 0 0.5rem;
    }
    .highlight {
        background-color: $highlight-background;
        padding-bottom: 0.2rem;
        padding-top: 0.2rem;
    }
</style>

{#each category.groups as group}
    <tr>
        <td class="name highlight" colspan="13">{group.name}</td>
    </tr>
    {#each group.sets as setName, setIndex}
        <tr>
            <td class="name">&ndash {setName}</td>

            {#each transmogSets[group.type] as transmogSet (`set--${setKey}--${setName}--${transmogSet.type}`)}
                <TransmogTableSet
                    set={group.data?.[transmogSet.type]?.[setIndex]}
                    span={transmogSet.span}
                    subType={transmogSet.subType}
                />
            {/each}
        </tr>
    {/each}
{/each}
