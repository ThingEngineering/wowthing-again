<script lang="ts">
    import { afterUpdate } from 'svelte'
    import active from 'svelte-spa-router/active'

    import { Constants } from '@/data/constants'
    import { gearState } from '@/stores/local-storage'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { Character, MultiSlugParams } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Options from './ItemsOptions.svelte'
    import RowBags from './ItemsTableRowBags.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './ItemsTableRowItems.svelte'
    import RowProfessions from './ItemsTableRowProfessions.svelte'
    import Search from './ItemsSearch.svelte'

    export let params: MultiSlugParams

    let filterFunc: (char: Character) => boolean
    $: {
        console.log(params)
        filterFunc = (char) => (
            ($gearState.showMaxLevel && char.level === Constants.characterMaxLevel) ||
            ($gearState.showOtherLevel && char.level < Constants.characterMaxLevel)
        )
    }

    afterUpdate(() => getSavedRoute('items', params.slug1, null, 'items-subnav'))
</script>

<style lang="scss">
    .items-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .items-pre {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<div class="items-wrapper">
    <nav class="subnav" id="items-subnav">
        <a href="#/items/bags" use:active>Bags</a>
        <a href="#/items/equipped" use:active>Equipped</a>
        <a href="#/items/professions" use:active>Professions</a>

        <a href="#/items/search" use:active={{path: /^\/items\/search/}}>Search</a>
    </nav>

    {#if params.slug1 === 'search'}
        <Search />
    {:else}
        <CharacterTable
            skipIgnored={true}
            {filterFunc}
        >
            <div class="items-pre" slot="preTable">
                <Options slug={params.slug1} />
            </div>

            <svelte:fragment slot="rowExtra" let:character>
                {#if params.slug1 === 'bags'}
                    <RowBags {character} />
                {:else if params.slug1 === 'equipped'}
                    <RowItemLevel />
                    <RowItems {character} />
                {:else if params.slug1 === 'professions'}
                    <RowProfessions {character} />
                {/if}
            </svelte:fragment>
        </CharacterTable>
    {/if}
</div>
