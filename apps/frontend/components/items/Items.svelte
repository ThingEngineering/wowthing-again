<script lang="ts">
    import active from 'svelte-spa-router/active';

    import { browserState } from '@/shared/state/browser.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import CharacterTable from '@/components/character-table/CharacterTable.svelte';
    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';
    import Convertible from './convertible/Convertible.svelte';
    import GuildBanks from './guild-banks/GuildBanks.svelte';
    import Options from './ItemsOptions.svelte';
    import RowBags from './ItemsTableRowBags.svelte';
    import RowGear from '@/components/home/table/row/HomeTableRowGear.svelte';
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte';
    import RowItems from './ItemsTableRowItems.svelte';
    import RowUpgrades from './ItemsTableRowUpgrades.svelte';
    import Search from './ItemsSearch.svelte';
    import Tokens from './tokens/Tokens.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('items', params.slug1, null, null, 'items-subnav'));
</script>

<style lang="scss">
    .items-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    .flex-wrapper {
        gap: 1rem;
        justify-content: flex-start;
        width: 100%;
    }
    nav {
        width: auto;
    }
</style>

<div class="items-wrapper">
    <div class="flex-wrapper">
        <nav class="subnav" id="items-subnav">
            <a href="#/items/bags" use:active>Bags</a>
            <a href="#/items/equipped" use:active>Equipped</a>

            <a
                class="b-l m-l"
                href="#/items/convertible"
                use:active={{ path: /^\/items\/convertible/ }}>Convertible</a
            >
            <a href="#/items/tokens" use:active={{ path: /^\/items\/tokens/ }}>Tokens</a>

            {#if !sharedState.public}
                <a
                    class="b-l m-l"
                    href="#/items/guild-banks"
                    use:active={{ path: /^\/items\/guild-banks/ }}>Guild Banks</a
                >
                <a href="#/items/search" use:active={{ path: /^\/items\/search/ }}>Search</a>
            {/if}
        </nav>

        {#if params.slug1 === 'convertible'}
            <div class="options-group">
                <Checkbox
                    name="current_expansion"
                    bind:value={browserState.current.convertible.includePurchases}
                    >Include purchased items</Checkbox
                >
            </div>
        {/if}
    </div>

    {#if params.slug1 === 'convertible'}
        <Convertible slug1={params.slug2} slug2={params.slug3} />
    {:else if params.slug1 === 'guild-banks'}
        <GuildBanks slug1={params.slug2} slug2={params.slug3} />
    {:else if params.slug1 === 'search'}
        <Search />
    {:else if params.slug1 === 'tokens'}
        <Tokens />
    {:else}
        <CharacterTable skipIgnored={params.slug1 !== 'bags'}>
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
