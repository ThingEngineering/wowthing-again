<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import { getContext } from 'svelte'

    import { collectionState } from '@/stores/local-storage'
    import type { ManualDataSetCategory } from '@/types/data/manual'
    import type { CollectionContext } from '@/types/contexts'

    import Category from './CollectionCategory.svelte'
    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    export let slug1: string
    export let slug2: string
    export let sets: ManualDataSetCategory[][]

    const { route, thingType } = getContext('collection') as CollectionContext

    let categories: ManualDataSetCategory[]
    $: {
        categories = filter(
            find(sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.groups.length > 0
        )
        if (slug2) {
            categories = filter(categories, (s) => s.slug === slug2)
        }
    }
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>

<div class="wrapper">
    <div class="options-container">
        <button>
            <Checkbox
                name="highlight_missing"
                bind:value={$collectionState.highlightMissing[route]}
            >Highlight missing</Checkbox>
        </button>

        <span>Show:</span>

        <button>
            <Checkbox
                name="show_collected"
                bind:value={$collectionState.showCollected[route]}
            >Collected</Checkbox>
        </button>

        <button>
            <Checkbox
                name="show_uncollected"
                bind:value={$collectionState.showUncollected[route]}
            >Missing</Checkbox>
        </button>
    </div>

    {#each categories as category}
        <Category
            {category}
            {route}
            {slug1}
            {thingType}
        />
    {/each}
</div>
