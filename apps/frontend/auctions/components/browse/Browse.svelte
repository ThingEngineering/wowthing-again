<script lang="ts">
    import { onMount } from 'svelte'
    import { location, replace } from 'svelte-spa-router'

    import { browseStore } from './store'
    import { auctionsAppState } from '@/auctions/stores/state'
    import { Region } from '@/enums/region'
    import { auctionStore } from '@/stores/auction'
    import type { MultiSlugParams } from '@/types'
    import type { AuctionCategory } from '@/types/data/auction'

    import Results from '@/auctions/components/results/Results.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    export let params: MultiSlugParams

    let categories: AuctionCategory[]
    let category: AuctionCategory
    let selected: string
    $: {
        const usefulParams = [params.slug2, params.slug3, params.slug4, params.slug5]
            .filter((slug) => !!slug)

        const newCategories: AuctionCategory[] = []
        let newCategory: AuctionCategory = undefined
        let newSelected: string = undefined
        for (const param of usefulParams) {
            if (param.indexOf(':') > 0) {
                newSelected = param
                continue
            }

            if (!newCategory) {
                newCategory = $auctionStore.categories.filter((cat) => cat.slug === param)[0]
            }
            else {
                newCategory = (newCategory.children || []).filter((cat) => cat.slug === param)[0]
            }

            if (!newCategory) {
                break
            }
            newCategories.push(newCategory)
        }

        if (!categories || categories.map((c) => c.slug).join('|') !== newCategories.map((c) => c.slug).join('|')) {
            categories = newCategories
        }
        if (newCategory?.id !== category?.id) {
            category = newCategory
        }
        if (newSelected !== selected) {
            selected = newSelected
        }
    }

    onMount(() => {
        if (params.slug1) {
            const oldRegion = $auctionsAppState.region
            const newRegion = Region[params.slug1.toUpperCase() as keyof typeof Region]
            if (oldRegion !== newRegion) {
                $auctionsAppState.region = newRegion
                replace($location.replace(
                    `/${Region[oldRegion].toLowerCase()}/`,
                    `/${Region[newRegion].toLowerCase()}/`
                ))
            }
        }
    })
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0;
    }
    .header {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="wrapper-column">
    <UnderConstruction />
    
    {#if category?.browseable}
        <div class="header">
            <span>
                <code>[{Region[$auctionsAppState.region]}]</code>
                Search
            </span>
            {#each categories as category, categoryIndex}
                <span>&gt;</span>
                <a href="#/browse/{params.slug1}/{categories.slice(0, categoryIndex + 1).map((c) => c.slug).join('/')}">
                    {category.name}
                </a>
            {/each}
        </div>
        
        <Results
            loadFunc={async () => await browseStore.fetch($auctionsAppState, $auctionStore, category.id)}
            url={`#/browse/${params.slug1}/${categories.map((c) => c.slug).join('/')}`}
            {selected}
        />
    {/if}
</div>
