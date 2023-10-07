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
    $: {
        categories = []

        category = $auctionStore.categories.filter((cat) => cat.slug === params.slug2)[0]
        if (!category) { break $ }
        categories.push(category)

        if (params.slug3) {
            category = (category.children || []).filter((cat) => cat.slug === params.slug3)[0]
            if (!category) { break $ }
            categories.push(category)

            if (params.slug4) {
                category = (category.children || []).filter((cat) => cat.slug === params.slug4)[0]
                if (!category) { break $ }
                categories.push(category)
            }
        }

        // Weapons/Armor no browse
        if (category.id === 1 || category.id === 24) {
            category = null
        }
    }

    onMount(() => {
        if (params.slug1) {
            const oldRegion = $auctionsAppState.region
            const newRegion = Region[params.slug1.toUpperCase() as keyof typeof Region]
            if (oldRegion !== newRegion) {
                $auctionsAppState.region = newRegion
                replace($location.replace(`/${Region[oldRegion].toLowerCase()}/`, `/${Region[newRegion].toLowerCase()}/`))
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
                <a href="#/browse/{categories.slice(0, categoryIndex + 1).map((c) => c.slug).join('/')}">
                    {category.name}
                </a>
            {/each}
        </div>
        
        {#await auctionsBrowseDataStore.fetch($auctionsAppState, $auctionStore, category.id)}
            L O A D I N G . . .
        {:then auctions}
            <Results
                selectedKey={`category:${category.id}`}
                {auctions}
            />
        {/await}
    {/if}
</div>
