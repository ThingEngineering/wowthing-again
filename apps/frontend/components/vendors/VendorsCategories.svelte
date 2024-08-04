<script lang="ts">
    import find from 'lodash/find'
    import { afterUpdate } from 'svelte'

    import { lazyStore, manualStore } from '@/stores'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import type { ManualDataVendorCategory } from '@/types/data/manual'

    import Category from './VendorsCategory.svelte'
    import Costs from './VendorsCosts.svelte'
    import Options from './VendorsOptions.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataVendorCategory[]
    let firstCategory: ManualDataVendorCategory
    let totalCosts: Record<string, Record<number, number>>
    $: {
        categories = find(
            $manualStore.vendors.sets,
            (cats: ManualDataVendorCategory[]) => cats !== null && cats[0].slug === slug1
        ) || []
        if (categories) {
            firstCategory = categories[0]
        }
        
        categories = categories.filter(
            (cat: ManualDataVendorCategory) => cat?.groups?.length > 0
        )

        if (slug2) {
            categories = categories.filter(
                (cat: ManualDataVendorCategory) => cat.slug === slug2
            )
        }

        totalCosts = {'OVERALL': {}}
        for (const category of categories) {
            totalCosts[category.slug] = {}
            for (const group of category.groups) {
                for (const thing of group.sellsFiltered) {
                    if (!$lazyStore.vendors.userHas[`${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`]) {
                        for (const currency in thing.costs) {
                            totalCosts['OVERALL'][currency] = (totalCosts['OVERALL'][currency] || 0) + thing.costs[currency]
                            totalCosts[category.slug][currency] = (totalCosts[category.slug][currency] || 0) + thing.costs[currency]
                        }
                    }
                }
            }
        }
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '0.75rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }
    
    afterUpdate(() => debouncedResize?.())
</script>

<style lang="scss">
    .spacer {
        margin-bottom: 0.5rem;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <Options />
    <div bind:this={resizeableElement}>
        {#if categories}
            <div class="collection thing-container" bind:this={resizeableElement}>
                {#if firstCategory && !slug2}
                    <SectionTitle
                        title={firstCategory.name}
                        count={$lazyStore.vendors.stats[`${slug1}`]}
                    >
                        <Costs costs={totalCosts.OVERALL} />
                    </SectionTitle>
                    <div class="spacer"></div>
                {/if}

                {#each categories as category}
                    <Category
                        {category}
                        slug1={slug1}
                        costs={totalCosts[category.slug]}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>
