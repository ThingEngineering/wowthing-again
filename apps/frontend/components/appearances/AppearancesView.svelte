<script lang="ts">
    import find from 'lodash/find'

    import { expansionMap } from '@/data/expansion'
    import { lazyStore } from '@/stores'
    import type { MultiSlugParams } from '@/types'
    import type { AppearanceDataSet } from '@/types/data/appearance'

    import Options from './AppearancesOptions.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
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
                const element = document.getElementById('sub-sidebar')
                    ?.querySelector(`a[href$="/appearances/${params.slug1}/${params.slug2}"] span`)
                if (element) {
                    name = `${params.slug1[0].toUpperCase()}${params.slug1.slice(1)} > ${element.innerHTML}`
                }
                else {
                    name = `${params.slug1[0].toUpperCase()}${params.slug1.slice(1)} > ${params.slug2[0].toUpperCase()}${params.slug2.slice(1)}`
                }
            }

            dataSlug = `${params.slug1}--${params.slug2}`
            sets = $lazyStore.appearances.appearances[dataSlug]
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
</style>

<div class="wrapper">
    <Options />

    {#if name && sets}
        <div class="collection thing-container">
            <SectionTitle
                count={$lazyStore.appearances.stats[dataSlug]}
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
