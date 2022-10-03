<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import type { SvelteComponent } from 'svelte'

    import { userStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage/auctions'
    import { Region } from '@/enums'
    import type { MultiSlugParams } from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import Custom from './AuctionsCustom.svelte'
    import ExtraPets from './AuctionsExtraPets.svelte'
    import Missing from './AuctionsMissing.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'

    export let params: MultiSlugParams

    let page: number
    let regions: [string, string][]
    $: {
        page = parseInt(params.slug2) || 1
        
        const regionMap: Record<number, boolean> = {}
        for (const character of $userStore.data.characters) {
            regionMap[character.realm.region] = true
        }

        regions = [['0', 'All']]
        for (const regionId of sortBy(Object.keys(regionMap), (key) => key)) {
            regions.push([
                regionId,
                Region[parseInt(regionId)],
            ])
        }
    }

    const componentMap: Record<string, typeof SvelteComponent> = {
        'custom-1': Custom,
        'custom-2': Custom,
        'custom-3': Custom,
        'custom-4': Custom,
        'custom-5': Custom,
        'custom-6': Custom,
        'custom-7': Custom,
        'custom-8': Custom,
        'custom-9': Custom,
        'custom-10': Custom,
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
    .options-group {
        display: flex;
        gap: 0.5rem;

        &:not(:last-child) {
            border-right: 1px solid $border-color;
            margin-right: 0.5rem;
            padding-right: 0.5rem;
        }
    }
</style>

<div class="auctions">
    <div class="options-container border">
        <div class="options-group">
            Sort:
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

        <div class="options-group">
            Region:
            <RadioGroup
                bind:value={$auctionState.region}
                name="region"
                options={regions}
            />
        </div>

        {#if params.slug1.startsWith('missing-')}
            <div class="options-group">
                <Checkbox
                    name="all_realms"
                    bind:value={$auctionState.allRealms}
                >All realms</Checkbox>
            </div>

            <div class="options-group">
                <Checkbox
                    name="hide_ignored"
                    bind:value={$auctionState.hideIgnored}
                >Hide ignored</Checkbox>
            </div>
        {/if}

        {#if params.slug1 === 'extra-pets'}
            <div class="options-group">
                Extra pets:
                <Checkbox
                    name="extra_pets_ignore_journal"
                    bind:value={$auctionState.extraPetsIgnoreJournal}
                >Ignore journal</Checkbox>
            </div>
        {:else if params.slug1 === 'missing-pets'}
            <div class="options-group">
                Pets:
                <Checkbox
                    name="pets_max_level"
                    bind:value={$auctionState.missingPetsMaxLevel}
                >Max level</Checkbox>
            </div>
        {/if}
    </div>

    <svelte:component
        this={componentMap[params.slug1]}
        slug={params.slug1}
        {page}
    />
</div>
