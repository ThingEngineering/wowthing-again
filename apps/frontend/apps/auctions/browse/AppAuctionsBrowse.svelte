<script lang="ts">
    import { auctionStore } from '@/stores/auction'
    import type { MultiSlugParams } from '@/types'
    import type { AuctionCategory } from '@/types/data/auction'

    import UnderConstruction from '@/components/common/UnderConstruction.svelte'

    export let params: MultiSlugParams

    let categories: AuctionCategory[]
    $: {
        categories = []

        let category = $auctionStore.categories.filter((cat) => cat.slug === params.slug1)[0]
        if (!category) { break $ }
        categories.push(category)

        if (params.slug2) {
            category = (category.children || []).filter((cat) => cat.slug === params.slug2)[0]
            if (!category) { break $ }
            categories.push(category)

            if (params.slug3) {
                category = (category.children || []).filter((cat) => cat.slug === params.slug3)[0]
                if (!category) { break $ }
                categories.push(category)
            }
        }
    }
</script>

<style lang="scss">
    .header {
        display: flex;
        gap: 0.25rem;
    }
    .wrapper-column {
        gap: 0;
    }
</style>

{#if categories}
    <div class="wrapper-column">
        <UnderConstruction />
        BROWSE REGION=US
        <div class="header">
            {#each categories as category, categoryIndex}
                {#if categoryIndex > 0}
                    <span>&gt;</span>
                {/if}
                <a href="#/browse/{categories.slice(0, categoryIndex + 1).map((c) => c.slug).join('/')}">
                    {category.name}
                </a>
            {/each}
        </div>

    </div>
{/if}
