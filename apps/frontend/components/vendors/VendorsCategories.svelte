    <script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'

    import { iconStrings } from '@/data/icons'
    import { itemStore, manualStore, staticStore } from '@/stores'
    import { VendorState, vendorState } from '@/stores/local-storage'
    import { userVendorStore } from '@/stores/user-vendors'
    import { getCurrencyCosts } from '@/utils/get-currency-costs'
    import type { ManualDataVendorCategory } from '@/types/data/manual'

    import CheckboxInput from '@/components/forms/CheckboxInput.svelte'
    import CurrencyLink from '@/components/links/CurrencyLink.svelte'
    import Group from './VendorsGroup.svelte'
    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import SectionTitle from '@/components/collections/CollectionSectionTitle.svelte'
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

    function getFilters(state: VendorState): string {
        let byType1: string[] = []
        let byType2: string[] = []
        let byThing: string[] = []
        let bySet: string[] = []

        if (state.showCloth) {
            byType1.push('C')
        }
        if (state.showLeather) {
            byType1.push('L')
        }
        if (state.showMail) {
            byType1.push('M')
        }
        if (state.showPlate) {
            byType1.push('P')
        }

        if (byType1.length === 0) {
            byType1 = ['---']
        }
        else if (byType1.length === 4) {
            byType1 = ['ALL']
        }

        if (state.showCloaks) {
            byType2.push('C')
        }
        if (state.showWeapons) {
            byType2.push('W')
        }

        if (byType2.length === 0) {
            byType2 = ['---']
        }
        else if (byType2.length === 2) {
            byType2 = ['ALL']
        }

        if (state.showIllusions) {
            byThing.push('I')
        }
        if (state.showMounts) {
            byThing.push('M')
        }
        if (state.showPets) {
            byThing.push('P')
        }
        if (state.showToys) {
            byThing.push('T')
        }

        if (byThing.length === 0) {
            byThing = ['---']
        }
        else if (byThing.length === 4) {
            byThing = ['ALL']
        }

        if (state.showPvp) {
            bySet.push('P')
        }
        if (state.showTier) {
            bySet.push('T')
        }

        if (bySet.length === 0) {
            bySet = ['---']
        }
        else if (bySet.length === 2) {
            bySet = ['ALL']
        }

        return `${byType1.join('')} | ${byType2.join('')} | ${byThing.join('')} | ${bySet.join('')}`
    }
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
    }
    .spacer {
        margin-bottom: 0.5rem;
    }
    .filters-toggle {
        margin-left: auto;
        margin-right: 0;
 
        :global(svg) {
            margin-top: -4px;
        }
    }
    .filters-container {
        justify-content: flex-end;
        margin-top: -0.25rem;

        button {
            background: #24282f;
            margin-right: 0;

            &:not(:last-child) {
                margin-right: -1px;
            }
        }
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
            
        <button class="filters-toggle"
            on:click={() => $vendorState.filtersExpanded = !$vendorState.filtersExpanded}
        >
            Filters: {getFilters($vendorState)}

            <IconifyIcon
                icon={iconStrings['chevron-' + ($vendorState.filtersExpanded ? 'down' : 'right')]}
            />
        </button>
    </div>

    {#if $vendorState.filtersExpanded}
        <div class="options-container filters-container">
            <span>Types:</span>

            <button>
                <CheckboxInput
                    name="show_cloth"
                    bind:value={$vendorState.showCloth}
                >Cloth</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_leather"
                    bind:value={$vendorState.showLeather}
                >Leather</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_mail"
                    bind:value={$vendorState.showMail}
                >Mail</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_plate"
                    bind:value={$vendorState.showPlate}
                >Plate</CheckboxInput>
            </button>

            <button class="margin-left">
                <CheckboxInput
                    name="show_cloaks"
                    bind:value={$vendorState.showCloaks}
                >Cloaks</CheckboxInput>
            </button>
            <button>
                <CheckboxInput
                    name="show_weapons"
                    bind:value={$vendorState.showWeapons}
                >Weapons</CheckboxInput>
            </button>
        </div>

        <div class="options-container filters-container">
            <span>Things:</span>

            <button>
                <CheckboxInput
                    name="show_illusions"
                    bind:value={$vendorState.showIllusions}
                >Illusions</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_mounts"
                    bind:value={$vendorState.showMounts}
                >Mounts</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_pets"
                    bind:value={$vendorState.showPets}
                >Pets</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_toys"
                    bind:value={$vendorState.showToys}
                >Toys</CheckboxInput>
            </button>
        </div>

        <div class="options-container filters-container">
            <span>Sets:</span>

            <button>
                <CheckboxInput
                    name="show_pvp"
                    bind:value={$vendorState.showPvp}
                >PvP</CheckboxInput>
            </button>

            <button>
                <CheckboxInput
                    name="show_tier"
                    bind:value={$vendorState.showTier}
                >Tier</CheckboxInput>
            </button>
        </div>
    {/if}

    {#if categories}
        <div class="collection thing-container">
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
