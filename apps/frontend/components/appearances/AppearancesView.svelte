<script lang="ts">
    import find from 'lodash/find'

    import { expansionMap } from '@/data/expansion'
    import { appearanceStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'
    import type { AppearanceDataSet } from '@/types/data/appearance'

    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'
    import Set from './AppearancesSet.svelte'

    export let params: MultiSlugParams

    let dataSlug: string
    let name: string
    let sets: AppearanceDataSet[]
    $: {
        sets = []
        if (params.slug2) {
            if (params.slug1 === 'expansion') {
                name = find(expansionMap, (exp) => exp.slug === params.slug2).name
            }
            else {
                name = `${params.slug1[0].toUpperCase()}${params.slug1.slice(1)} > ${params.slug2[0].toUpperCase()}${params.slug2.slice(1)}`
            }
            dataSlug = `${params.slug1}--${params.slug2}`

            sets = $appearanceStore.data.appearances[dataSlug]
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
</style>

<div class="wrapper">
    {#if name && sets}
        <div class="collection thing-container">
            <SectionTitle
                count={$appearanceStore.data.stats[dataSlug]}
                title={name}
            />
            
            <div class="collection-v2-section">
                {#each sets as set}
                    <Set
                        slug={`${dataSlug}--${set.name}`}
                        {set}
                    />
                {/each}
            </div>
        </div>
    {/if}
</div>
