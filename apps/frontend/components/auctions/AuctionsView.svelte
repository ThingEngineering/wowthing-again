<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import { auctionState } from '@/stores/local-storage/auctions'
    import type { MultiSlugParams } from '@/types'

    import ExtraPets from './AuctionsExtraPets.svelte'
    import Missing from './AuctionsMissing.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'

    export let params: MultiSlugParams

    let page: number
    $: {
        page = parseInt(params.slug2) || 1
    }

    const componentMap: Record<string, typeof SvelteComponent> = {
        'extra-pets': ExtraPets,
        'missing-mounts': Missing,
        'missing-pets': Missing,
        'missing-toys': Missing,
    }
</script>

<style lang="scss">
    .options-container {
        padding: 0.2rem 0.3rem;
    }
</style>

<div class="auctions">
    <div class="options-container border">
        <div class="radio-container">
            <RadioGroup
                bind:value={$auctionState.sortBy[params.slug1]}
                name="sort_by"
                options={[
                    ['name_up', 'Name :arrow-up:'],
                    ['name_down', 'Name :arrow-down:'],
                    ['price_up', 'Price :arrow-up:'],
                    ['price_down', 'Price :arrow-down:'],
                ]}
            />
        </div>
    </div>

    <svelte:component
        this={componentMap[params.slug1]}
        slug={params.slug1}
        {page}
    />
</div>
