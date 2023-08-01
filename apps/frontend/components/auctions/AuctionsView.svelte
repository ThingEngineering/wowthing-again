<script lang="ts">
    import sortBy from 'lodash/sortBy'
    import type { SvelteComponent } from 'svelte'

    import { userStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage/auctions'
    import { ItemQuality, Region, WeaponSubclass } from '@/enums'
    import type { MultiSlugParams } from '@/types'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import Custom from './AuctionsCustom.svelte'
    import ExtraPets from './AuctionsExtraPets.svelte'
    import Missing from './AuctionsMissing.svelte'
    import MissingTransmog from './AuctionsMissingTransmog.svelte'
    import RadioGroup from '@/components/forms/RadioGroup.svelte'
    import Select from '@/components/forms/Select.svelte'
    import TextInput from '@/components/forms/TextInput.svelte'

    export let params: MultiSlugParams

    let auctionsContainer: HTMLElement
    let page: number
    let regions: [string, string][]
    $: {
        page = parseInt(params.slug2) || 1
        
        const regionMap: Record<number, boolean> = {}
        for (const character of $userStore.characters) {
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

    const weaponOptions: [number, string][] = Object.entries(WeaponSubclass)
        .filter(([key, value]) => !isNaN(parseInt(key)) && value !== 'Thrown' && value !== 'FishingPole')
        .map(([key, value]) => [parseInt(key), value as string])
    weaponOptions.splice(0, 0, [-1, 'Any'])

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
        'missing-transmog': MissingTransmog,
    }
</script>

<style lang="scss">
    .auctions {
        overflow-x: hidden;
        width: 100%;
    }
    .options-container {
        padding: 0.2rem 0.3rem;
    }
    .options-group {
        align-items: center;
        display: flex;
        gap: 0.5rem;

        &:not(:last-child) {
            border-right: 1px solid $border-color;
            margin-right: 0.5rem;
            padding-right: 0.5rem;
        }

        :global(select[name="transmog_min_quality"]) {
            width: 8rem;
        }
        :global(select[name="transmog_item_subclass_armor"]) {
            width: 8rem;
        }
        :global(select[name="transmog_item_subclass_weapon"]) {
            width: 11rem;
        }
    }
</style>

<div class="auctions" bind:this={auctionsContainer}>
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

            {#if !params.slug1.endsWith('-transmog')}
                <div class="options-group">
                    <Checkbox
                        name="hide_ignored"
                        bind:value={$auctionState.hideIgnored}
                    >Hide ignored</Checkbox>
                </div>
            {/if}
        {/if}

        {#if params.slug1 === 'missing-transmog'}
            <div class="options-group">
                <Checkbox
                    name="limit_to_cheapest_realm"
                    bind:value={$auctionState.limitToCheapestRealm}
                >Only cheapest</Checkbox>
            </div>
        {:else}
            <div class="options-group">
                <Checkbox
                    name="limit_to_best_realms"
                    bind:value={$auctionState.limitToBestRealms}
                >Only top 5</Checkbox>
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
                <Checkbox
                    name="pets_max_level"
                    bind:value={$auctionState.missingPetsMaxLevel}
                >Only level 25</Checkbox>
            </div>
        {/if}
    </div>

    {#if params.slug1 === 'missing-transmog'}
        <div class="options-container border">
            <div class="options-group">
                <TextInput
                    name="transmog_name_search"
                    maxlength={20}
                    placeholder={"Name filter"}
                    clearButton={true}
                    inputWidth={"10rem"}
                    bind:value={$auctionState.missingTransmogNameSearch}
                />
            </div>

            <div class="options-group">
                <TextInput
                    name="transmog_realm_search"
                    maxlength={20}
                    placeholder={"Realm filter"}
                    clearButton={true}
                    inputWidth={"10rem"}
                    bind:value={$auctionState.missingTransmogRealmSearch}
                />
            </div>

            <div class="options-group">
                Min quality:
                <Select
                    name="transmog_min_quality"
                    bind:selected={$auctionState.missingTransmogMinQuality}
                    options={[
                        [ItemQuality.Poor, 'Poor'],
                        [ItemQuality.Common, 'Common'],
                        [ItemQuality.Uncommon, 'Uncommon'],
                        [ItemQuality.Rare, 'Rare'],
                        [ItemQuality.Epic, 'Epic'],
                        [ItemQuality.Legendary, 'Legendary'],
                    ]}
                />
            </div>

            <div class="options-group">
                Item type:
                <RadioGroup
                    bind:value={$auctionState.missingTransmogItemClass}
                    name="transmog_item_class"
                    options={[
                        ['any', 'Any'],
                        ['armor', 'Armor'],
                        ['weapon', 'Weapon'],
                    ]}
                />

                {#if $auctionState.missingTransmogItemClass === 'armor'}
                    <Select
                        name="transmog_item_subclass_armor"
                        bind:selected={$auctionState.missingTransmogItemSubclassArmor}
                        options={[
                            [-1, 'Any'],
                            [1, 'Cloth'],
                            [2, 'Leather'],
                            [3, 'Mail'],
                            [4, 'Plate'],
                        ]}
                    />
                {:else if $auctionState.missingTransmogItemClass === 'weapon'}
                    <Select
                        name="transmog_item_subclass_weapon"
                        bind:selected={$auctionState.missingTransmogItemSubclassWeapon}
                        options={weaponOptions}
                    />
                {/if}
            </div>

        </div>
    {/if}

    <svelte:component
        this={componentMap[params.slug1]}
        slug={params.slug1}
        {auctionsContainer}
        {page}
    />
</div>
