<script lang="ts">
    import { onMount } from 'svelte'
    import { location, replace } from 'svelte-spa-router'

    import { auctionsAppState } from '../state'
    import { Region } from '@/enums/region'
    import { auctionStore } from '@/stores/auction'
    import { auctionsBrowseDataStore } from '@/stores/auctions/browse'
    import type { MultiSlugParams } from '@/types'
    import type { AuctionCategory } from '@/types/data/auction'

    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    import Results from './AppAuctionsBrowseResults.svelte'

    export let params: MultiSlugParams

    let categories: AuctionCategory[]
    let category: AuctionCategory
    let selected: string
    $: {
        const usefulParams = [params.slug2, params.slug3, params.slug4, params.slug5]
            .filter((slug) => !!slug)

        let newCategories: AuctionCategory[] = []
        let newCategory: AuctionCategory
        let newSelected: string
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

        if (!categories || categories.map((c) => c.slug).join('|') !== newCategories.map((c) => c.slub).join('|')) {
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
    .header {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }
    .wrapper-column {
        gap: 0;
    }
</style>

<div class="wrapper-column">
    <UnderConstruction />
    
    {#if category?.browseable}
        <div class="header">
            {Region[$auctionsAppState.region]}
            {#each categories as category, categoryIndex}
                <span>&gt;</span>
                <a href="#/browse/{params.slug1}/{categories.slice(0, categoryIndex + 1).map((c) => c.slug).join('/')}">
                    {category.name}
                </a>
            {/each}
        </div>
        
        {#await auctionsBrowseDataStore.fetch($auctionsAppState, $auctionStore, category.id)}
            <tr>
                <td colspan="4">
                    L O A D I N G . . .
                </td>
            </tr>
        {:then auctions}
            <Results
                selected={params.slug5}
                url={`#/browse/${params.slug1}/${categories.map((c) => c.slug).join('/')}`}
                {auctions}
            />
        {/await}
    {/if}
</div>
