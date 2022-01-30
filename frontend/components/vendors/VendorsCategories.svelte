<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { costMap, costOrder } from '@/data/vendors'
    import { vendorState } from '@/stores/local-storage'
    import { data as settingsData } from '@/stores/settings'
    import { staticStore } from '@/stores/static'
    import { userVendorStore } from '@/stores/user-vendors'
    import getFilteredCategories from '@/utils/vendors/get-filtered-categories'
    import type { StaticDataVendorCategory } from '@/types/data/static'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import Group from './VendorsGroup.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let slug1: string
    export let slug2: string

    let categories: StaticDataVendorCategory[]
    let totalCosts: Record<string, Record<string, number>>
    $: {
        let baseCategories = filter(
            find(
                $staticStore.data.vendorSets,
                (cats: StaticDataVendorCategory[]) => cats !== null && cats[0].slug === slug1
            ),
            (cat: StaticDataVendorCategory) => cat?.groups?.length > 0
        )

        if (slug2) {
            baseCategories = filter(
                baseCategories,
                (cat: StaticDataVendorCategory) => cat.slug === slug2
            )
        }

        categories = getFilteredCategories($settingsData, baseCategories)

        totalCosts = {}
        for (const category of categories) {
            totalCosts[category.slug] = {}
            for (const group of category.groups) {
                for (const thing of group.things) {
                    if (!$userVendorStore.data.userHas[`${group.type}-${thing.id}`]) {
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
        float: right;
        font-size: 90%;
        gap: 0.5rem;
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
                <SectionTitle
                    title={category.name}
                    count={$userVendorStore.data.stats[`${slug1}--${category.slug}`]}
                >
                    {#if totalCosts[category.slug]}
                        <span class="costs">
                            {#each costOrder as cost}
                                {#if totalCosts[category.slug][cost]}
                                    <div>
                                        {totalCosts[category.slug][cost].toLocaleString()}
                                        <WowheadLink
                                            type={costMap[cost][0]}
                                            id={costMap[cost][1]}
                                        >
                                            <WowthingImage
                                                name="{costMap[cost][0]}/{costMap[cost][1]}"
                                                size={20}
                                                border={0}
                                            />
                                        </WowheadLink>
                                    </div>
                                {/if}
                            {/each}
                        </span>
                    {/if}
                </SectionTitle>

                <div class="collection-section">
                    {#each category.groups as group, groupIndex}
                        <Group
                            stats={$userVendorStore.data.stats[`${slug1}--${category.slug}--${groupIndex}`]}
                            {group}
                        />
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
