<script lang="ts">
    import type { ComponentType } from 'svelte'

    import { expansionOrder } from '@/data/expansion'
    import { ItemQuality } from '@/enums/item-quality'
    import { Profession } from '@/enums/profession'
    import { Region } from '@/enums/region'
    import { WeaponSubclass } from '@/enums/weapon-subclass'
    import { userStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage/auctions'
    import type { MultiSlugParams } from '@/types'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'
    import Commodities from './commodities/Commodities.svelte'
    import Custom from './AuctionsCustom.svelte'
    import ExtraPets from './AuctionsExtraPets.svelte'
    import Missing from './AuctionsMissing.svelte'
    import MissingBigResults from './AuctionsMissingBigResults.svelte'
    import RadioGroup from '@/shared/components/forms/RadioGroup.svelte'
    import Select from '@/shared/components/forms/Select.svelte'
    import SpecificItem from './AuctionsSpecificItem.svelte'
    import TextInput from '@/shared/components/forms/TextInput.svelte'

    export let params: MultiSlugParams

    let auctionsContainer: HTMLElement
    let page: number
    let regions: [string, string][]
    $: {
        page = parseInt(params.slug2) || 1

        regions = [['0', 'All']]
        for (const regionId of $userStore.allRegions) {
            regions.push([
                regionId.toString(),
                Region[regionId],
            ])
        }
    }

    const expansionOptions: [number, string][] = expansionOrder
        .map((expansion) => [expansion.id, expansion.name])

    const professionOptions: [number, string][] = Object.entries(Profession)
        .filter(([key,]) => !isNaN(parseInt(key)))
        .map(([key, value]) => [parseInt(key), value] as [number, string])
        .filter(([, value]) => ['Archaeology', 'Fishing', 'Herbalism', 'Mining', 'Skinning'].indexOf(value) === -1)
    professionOptions.sort((a, b) => a[1].localeCompare(b[1]))

    const weaponOptions: [number, string][] = Object.entries(WeaponSubclass)
        .filter(([key, value]) => !isNaN(parseInt(key)) && value !== 'Thrown' && value !== 'FishingPole')
        .map(([key, value]) => [parseInt(key), value as string])
    weaponOptions.splice(0, 0, [-1, 'Any'])

    const componentMap: Record<string, ComponentType> = {
        'commodities': Commodities,
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
        'missing-appearance-ids': MissingBigResults,
        'missing-appearance-sources': MissingBigResults,
        'missing-recipes': MissingBigResults,
        'specific-item': SpecificItem,
    }
</script>

<style lang="scss">
    .auctions {
        overflow-x: hidden;
        width: 100%;
    }
    .options-container {
        padding: 0.2rem 0.3rem;

        .options-group:not(:last-child) {
            border-right: 1px solid $border-color;
            margin-right: 0.5rem;
        }
    }
    .options-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }
    .options-group {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        height: 2rem;

        &.border {
            padding: 0 0.3rem;
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

            {#if $auctionState.region === '3'}
                <Checkbox
                    name="include_russia"
                    bind:value={$auctionState.includeRussia}
                >Include RU</Checkbox>
            {/if}
        </div>


        {#if params.slug1.startsWith('missing-')}
            <div class="options-group">
                <Checkbox
                    name="all_realms"
                    bind:value={$auctionState.allRealms}
                >All realms</Checkbox>
            </div>

            {#if !params.slug1.startsWith('missing-appearance-') && params.slug1 !== 'missing-recipes'}
                <div class="options-group">
                    <Checkbox
                        name="hide_ignored"
                        bind:value={$auctionState.hideIgnored}
                    >Hide ignored</Checkbox>
                </div>
            {/if}
        {/if}

        {#if params.slug1.startsWith('missing-appearance-') || params.slug1 === 'missing-recipes'}
            <div class="options-group">
                <Checkbox
                    name="limit_to_cheapest_realm"
                    bind:value={$auctionState.limitToCheapestRealm}
                >Only cheapest</Checkbox>
            </div>
            <div class="options-group">
                <Checkbox
                    name="show_dont_have"
                    bind:value={$auctionState.showDontHave}
                >Don't have</Checkbox>

                <Checkbox
                    name="show_have"
                    bind:value={$auctionState.showHave}
                >Have</Checkbox>
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

    {#if params.slug1.startsWith('missing-appearance-')}
        <div class="options-wrapper">
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
                    width={"8rem"}
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

            <div class="options-group border">
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
                        width={"8rem"}
                        bind:selected={$auctionState.missingTransmogItemSubclassArmor}
                        options={[
                            [-1, 'Any'],
                            [1, 'Cloth'],
                            [2, 'Leather'],
                            [3, 'Mail'],
                            [4, 'Plate'],
                            [5, 'Cosmetic'],
                            [20, 'Cloak'],
                            [100, 'Shirt'],
                            [21, 'Tabard'],
                        ]}
                    />
                {:else if $auctionState.missingTransmogItemClass === 'weapon'}
                    <Select
                        name="transmog_item_subclass_weapon"
                        width={"11rem"}
                        bind:selected={$auctionState.missingTransmogItemSubclassWeapon}
                        options={weaponOptions}
                    />
                {/if}
            </div>

            <div class="options-group">
                Expansion:
                <Select
                    name="transmog_expansion"
                    width={"12.5rem"}
                    bind:selected={$auctionState.missingTransmogExpansion}
                    options={
                        [
                            [-1, '- All -'],
                            ...expansionOptions,
                        ]
                    }
                />
            </div>

            <div class="options-group border">
                <Checkbox
                    name="transmog_show_crafted"
                    bind:value={$auctionState.missingTransmogShowCrafted}
                >Crafted</Checkbox>

                <!-- <Checkbox
                    name="transmog_show_raid"
                    bind:value={$auctionState.missingTransmogShowRaid}
                >Raid</Checkbox> -->
            </div>

            <div class="options-group">
                <TextInput
                    name="transmog_maximum_gold"
                    maxlength={9}
                    placeholder={"Maximum gold"}
                    clearButton={true}
                    inputWidth={"8rem"}
                    bind:value={$auctionState.missingTransmogMaxGold}
                />
            </div>
        </div>

    {:else if params.slug1 === 'missing-recipes'}
        <div class="options-wrapper">
            <div class="options-group">
                <TextInput
                    name="recipe_name_search"
                    maxlength={20}
                    placeholder={"Name filter"}
                    clearButton={true}
                    inputWidth={"10rem"}
                    bind:value={$auctionState.missingRecipeNameSearch}
                />
            </div>

            <div class="options-group">
                <TextInput
                    name="recipe_realm_search"
                    maxlength={20}
                    placeholder={"Realm filter"}
                    clearButton={true}
                    inputWidth={"10rem"}
                    bind:value={$auctionState.missingRecipeRealmSearch}
                />
            </div>
            
            <div class="options-group">
                Item type:
                <RadioGroup
                    bind:value={$auctionState.missingRecipeSearchType}
                    name="recipe_search_type"
                    options={[
                        ['account', 'Account'],
                        ['character', 'Character'],
                    ]}
                />
            </div>

            {#if $auctionState.missingRecipeSearchType === 'character'}
                <div class="options-group">
                    Character:
                    <Select
                        name="recipe_character_id"
                        width={'9.5rem'}
                        bind:selected={$auctionState.missingRecipeCharacterId}
                        options={$userStore.characters.map((char) => [
                            char.id,
                            char.name + '-' + char.realm.name
                        ])}
                    />
                </div>
            {/if}

            <div class="options-group">
                Profession:
                <Select
                    name="recipe_profession_id"
                    width={'9.5rem'}
                    bind:selected={$auctionState.missingRecipeProfessionId}
                    options={
                        [
                            [-1, '- All -'],
                            ...professionOptions,
                        ]
                    }
                />
            </div>

            <div class="options-group">
                Expansion:
                <Select
                    name="recipe_expansion"
                    width={'12.5rem'}
                    bind:selected={$auctionState.missingRecipeExpansion}
                    options={
                        [
                            [-1, '- All -'],
                            ...expansionOptions,
                        ]
                    }
                />
            </div>
        </div>
    {/if}


    <svelte:component
        this={componentMap[params.slug1]}
        slug1={params.slug1}
        slug2={params.slug2}
        {auctionsContainer}
        {page}
    />
</div>
