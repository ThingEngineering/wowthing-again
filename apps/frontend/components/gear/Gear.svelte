<script lang="ts">
    import { afterUpdate } from 'svelte'
    import active from 'svelte-spa-router/active'

    import { Constants } from '@/data/constants'
    import { gearState } from '@/stores/local-storage'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { Character, MultiSlugParams } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import Options from './GearOptions.svelte'
    import RowBags from './GearTableRowBags.svelte'
    import RowItemLevel from '@/components/character-table/row/ItemLevel.svelte'
    import RowItems from './GearTableRowItems.svelte'
    import RowProfessions from './GearTableRowProfessions.svelte'

    export let params: MultiSlugParams

    let filterFunc: (char: Character) => boolean
    $: {
        filterFunc = (char) => (
            ($gearState.showMaxLevel && char.level === Constants.characterMaxLevel) ||
            ($gearState.showOtherLevel && char.level < Constants.characterMaxLevel)
        )
    }

    afterUpdate(() => getSavedRoute('gear', params.slug1, null, 'gear-subnav'))
</script>

<style lang="scss">
    .gear-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    nav {
        background: $highlight-background;
        border: 1px solid $border-color;
        display: flex;

        a {
            border-right: 1px solid $border-color;
            padding: 0.4rem 1rem;

            &:global(.active) {
                background: $active-background;
                color: #fff;
            }
        }
    }
    .gear-pre {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<div class="gear-wrapper">
    <nav class="gear-subnav" id="gear-subnav">
        <a href="#/gear/equipped" use:active>Equipped</a>
        <a href="#/gear/bags" use:active>Bags</a>
        <a href="#/gear/professions" use:active>Professions</a>
    </nav>

    <CharacterTable
        skipIgnored={true}
        {filterFunc}
    >
        <div class="gear-pre" slot="preTable">
            <Options slug={params.slug1} />
        </div>

        <svelte:fragment slot="rowExtra" let:character>
            {#if params.slug1 === 'equipped'}
                <RowItemLevel />
                <RowItems {character} />
            {:else if params.slug1 === 'bags'}
                <RowBags {character} />
            {:else if params.slug1 === 'professions'}
                <RowProfessions {character} />
            {/if}
        </svelte:fragment>
    </CharacterTable>
</div>
