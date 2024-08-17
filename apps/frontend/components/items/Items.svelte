<script lang="ts">
    import { afterUpdate } from 'svelte'
    import active from 'svelte-spa-router/active'

    import { userStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Convertible from './convertible/Convertible.svelte'
    import Options from './ItemsOptions.svelte'
    import RowBags from './ItemsTableRowBags.svelte'
    import RowGear from '@/components/home/table/row/HomeTableRowGear.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './ItemsTableRowItems.svelte'
    import RowUpgrades from './ItemsTableRowUpgrades.svelte'
    import Search from './ItemsSearch.svelte'
    import Tokens from './tokens/Tokens.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('items', params.slug1, null, 'items-subnav'))
</script>

<style lang="scss">
    .items-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
</style>

<div class="items-wrapper">
    <nav class="subnav" id="items-subnav">
        <a href="#/items/bags" use:active>Bags</a>
        <a href="#/items/equipped" use:active>Equipped</a>

        <a href="#/items/convertible" use:active={{path: /^\/items\/convertible/}}>Convertible</a>
        <a href="#/items/tokens" use:active={{path: /^\/items\/tokens/}}>Tokens</a>
        {#if !$userStore.public}
            <a href="#/items/search" use:active={{path: /^\/items\/search/}}>Search</a>
        {/if}
    </nav>

    {#if params.slug1 === 'convertible'}
        <Convertible
            slug1={params.slug2}
            slug2={params.slug3}
        />
    {:else if params.slug1 === 'tokens'}
        <Tokens
            slug1={params.slug2}
            slug2={params.slug3}
        />
    {:else if params.slug1 === 'search'}
        <Search />
    {:else}
        <CharacterTable
            skipIgnored={params.slug1 !== 'bags'}
        >
            <div class="items-pre" slot="preTable">
                <Options slug={params.slug1} />
            </div>

            <svelte:fragment slot="rowExtra" let:character>
                {#if params.slug1 === 'bags'}
                    <RowBags {character} />
                {:else if params.slug1 === 'equipped'}
                    <RowItemLevel {character} />
                    <RowGear {character} />
                    <RowItems {character} />
                    <RowUpgrades {character} />
                {/if}
            </svelte:fragment>
        </CharacterTable>
    {/if}
</div>
