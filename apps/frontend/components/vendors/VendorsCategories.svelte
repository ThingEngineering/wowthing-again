<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { manualStore } from '@/stores'
    import { vendorState } from '@/stores/local-storage'
    import { userVendorStore } from '@/stores/user-vendors'
    import { getCurrencyCosts } from '@/utils/get-currency-costs'
    import type { ManualDataVendorCategory } from '@/types/data/manual'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Group from './VendorsGroup.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataVendorCategory[]
    let totalCosts: Record<string, Record<number, number>>
    $: {
        categories = filter(
            find(
                $manualStore.data.vendors.sets,
                (cats: ManualDataVendorCategory[]) => cats !== null && cats[0].slug === slug1
            ),
            (cat: ManualDataVendorCategory) => cat?.groups?.length > 0
        )

        if (slug2) {
            categories = filter(
                categories,
                (cat: ManualDataVendorCategory) => cat.slug === slug2
            )
        }

        totalCosts = {}
        for (const category of categories) {
            totalCosts[category.slug] = {}
            for (const group of category.groups) {
                for (const thing of group.sellsFiltered) {
                    if (!$userVendorStore.data.userHas[`${thing.type}-${thing.id}`]) {
                        for (const currency in thing.costs) {
                            totalCosts[category.slug][currency] = (totalCosts[category.slug][currency] || 0) + thing.costs[currency]
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .costs {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        color: $body-text;
        display: flex;
        flex-wrap: wrap;
        font-size: 90%;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-left: auto;
        padding-left: 1rem;
    }
    .collection-v2-section {
        --column-count: 1;
        --column-gap: 1rem;
        --column-width: 18rem;

        width: 18.75rem;
        
        @media screen and (min-width: 1100px) {
            --column-count: 2;
            width: 37.75rem;
        }
        @media screen and (min-width: 1405px) {
            --column-count: 3;
            width: 56.75rem;
        }
        @media screen and (min-width: 1710px) {
            --column-count: 4;
            width: 75.75rem;
        }
        @media screen and (min-width: 2015px) {
            --column-count: 5;
            width: 94.75rem;
        }
    }
</style>

<div class="wrapper">
    <div class="options-container">
        <button>
            <CheckboxInput
                name="highlight_missing"
                bind:value={$vendorState.highlightMissing}
            >Highlight missing</CheckboxInput>
        </button>

        <span>Show:</span>

        <button>
            <CheckboxInput
                name="show_collected"
                bind:value={$vendorState.showCollected}
            >Collected</CheckboxInput>
        </button>

        <button>
            <CheckboxInput
                name="show_uncollected"
                bind:value={$vendorState.showUncollected}
            >Missing</CheckboxInput>
        </button>
    </div>

    {#if categories}
        <div class="collection thing-container">
            {#each categories as category}
                {@const useV2 = category.groups.length > 3 && category.groups.reduce((a, b) => a + b.sellsFiltered.length, 0) > 30}
                <SectionTitle
                    title={category.name}
                    count={$userVendorStore.data.stats[`${slug1}--${category.slug}`]}
                >
                    {#if totalCosts[category.slug]}
                        <span class="costs">
                            {#each getCurrencyCosts($manualStore.data, totalCosts[category.slug]) as [linkType, linkId, value]}
                                <div>
                                    {value}
                                    <WowheadLink
                                        type={linkType}
                                        id={linkId}
                                    >
                                        <WowthingImage
                                            name="{linkType}/{linkId}"
                                            size={20}
                                            border={0}
                                        />
                                    </WowheadLink>
                                </div>
                            {/each}
                        </span>
                    {/if}
                </SectionTitle>

                <div class="collection{useV2 ? '-v2' : ''}-section">
                    {#each category.groups as group, groupIndex}
                        {#if group.sellsFiltered.length > 0}
                            <Group
                                stats={$userVendorStore.data.stats[`${slug1}--${category.slug}--${groupIndex}`]}
                                {group}
                                {useV2}
                            />
                        {/if}
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
