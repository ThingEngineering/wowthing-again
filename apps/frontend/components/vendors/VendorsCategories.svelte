    <script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { itemStore, manualStore, staticStore } from '@/stores'
    import { userVendorStore } from '@/stores/user-vendors'
    import { getCurrencyCosts } from '@/utils/get-currency-costs'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import type { ManualDataVendorCategory } from '@/types/data/manual'

    import CurrencyLink from '@/components/links/CurrencyLink.svelte'
    import Group from './VendorsGroup.svelte'
    import Options from './VendorsOptions.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let slug1: string
    export let slug2: string

    let categories: ManualDataVendorCategory[]
    let firstCategory: ManualDataVendorCategory
    let totalCosts: Record<string, Record<number, number>>
    $: {
        categories = find(
            $manualStore.vendors.sets,
            (cats: ManualDataVendorCategory[]) => cats !== null && cats[0].slug === slug1
        )
        if (categories) {
            firstCategory = categories[0]
        }
        
        categories = filter(
            categories,
            (cat: ManualDataVendorCategory) => cat?.groups?.length > 0
        )

        if (slug2) {
            categories = filter(
                categories,
                (cat: ManualDataVendorCategory) => cat.slug === slug2
            )
        }

        totalCosts = {'OVERALL': {}}
        for (const category of categories) {
            totalCosts[category.slug] = {}
            for (const group of category.groups) {
                for (const thing of group.sellsFiltered) {
                    if (!$userVendorStore.userHas[`${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`]) {
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
                    padding: '1.5rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }

</script>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        width: 100%;
    }
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
    .spacer {
        margin-bottom: 0.5rem;
    }
    .costs {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        color: $body-text;
        display: flex;
        flex-wrap: wrap;
        //font-size: 90%;
        gap: 0.5rem;
        justify-content: flex-end;
        margin-left: auto;
        padding-left: 1rem;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="wrapper" bind:this={containerElement}>
    <div class="wrapper2" bind:this={resizeableElement}>
        <Options />

        {#if categories}
            <div class="collection thing-container" bind:this={resizeableElement}>

                {#if firstCategory && !slug2}
                    <SectionTitle
                        title={firstCategory.name}
                        count={$userVendorStore.stats[`${slug1}`]}
                    >
                        <span class="costs">
                            {#each getCurrencyCosts($itemStore, $staticStore, totalCosts['OVERALL'], true, true) as [linkType, linkId, value]}
                                <div>
                                    <CurrencyLink
                                        currencyId={linkType === 'currency' ? linkId : undefined}
                                        itemId={linkType === 'item' ? linkId : undefined}
                                    >
                                        <WowthingImage
                                            name="{linkType}/{linkId}"
                                            size={20}
                                            border={0}
                                        />
                                        {value}
                                    </CurrencyLink>
                                </div>
                            {/each}
                        </span>
                    </SectionTitle>
                    <div class="spacer"></div>
                {/if}

                {#each categories as category}
                    {@const useV2 = category.groups.length > 3 && category.groups.reduce((a, b) => a + b.sellsFiltered.length, 0) > 30}
                    <SectionTitle
                        title={category.name}
                        count={$userVendorStore.stats[`${slug1}--${category.slug}`]}
                    >
                        {#if totalCosts[category.slug]}
                            <span class="costs">
                                {#each getCurrencyCosts($itemStore, $staticStore, totalCosts[category.slug], true, true) as [linkType, linkId, value]}
                                    <div>
                                        <CurrencyLink
                                            currencyId={linkType === 'currency' ? linkId : undefined}
                                            itemId={linkType === 'item' ? linkId : undefined}
                                        >
                                            <WowthingImage
                                                name="{linkType}/{linkId}"
                                                size={20}
                                                border={0}
                                            />
                                            {value}
                                        </CurrencyLink>
                                    </div>
                                {/each}
                            </span>
                        {/if}
                    </SectionTitle>

                    <div class="collection{useV2 ? '-v2' : ''}-section">
                        {#each category.groups as group, groupIndex}
                            {#if group.sellsFiltered.length > 0}
                                <Group
                                    stats={$userVendorStore.stats[`${slug1}--${category.slug}--${groupIndex}`]}
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
</div>
