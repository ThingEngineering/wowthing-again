<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import { getContext } from 'svelte'

    import { userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type { ManualDataSetCategory } from '@/types/data/manual'
    import type { CollectionContext } from '@/types/contexts'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import CollectionThing from './CollectionThing.svelte'
    import CollectionThingPet from './CollectionThingPet.svelte'
    import SectionTitle from './CollectionSectionTitle.svelte'

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
    .collection-v2-section {
        --column-count: 1;
        --column-gap: 1.25rem;
        --column-width: 18.75rem;

        width: 18.75rem;
        
        @media screen and (min-width: 1130px) {
            --column-count: 2;
            width: 39.5rem;
        }
        @media screen and (min-width: 1445px) {
            --column-count: 3;
            width: 59.5rem;
        }
        @media screen and (min-width: 1770px) {
            --column-count: 4;
            width: 79.5rem;
        }
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
        {@const useV2 = category.groups.length > 2 && category.groups.reduce((a, b) => a + b.things.length, 0) > 30}
        <div class="collection thing-container">
            {#if category.name}
                <SectionTitle
                    title={category.name}
                    count={$userStore.data.setCounts[route][`${slug1}--${category.slug}`]}
                />
            {/if}

            <div class="collection{useV2 ? '-v2' : ''}-section">
                {#each category.groups as group}
                    <div
                        class="collection{useV2 ? '-v2' : ''}-group"
                    >
                        <h4
                            class="drop-shadow text-overflow {getPercentClass($userStore.data.setCounts[route][`${slug1}--${category.slug}--${group.name}`])}"
                            use:tippy={group.name}
                        >
                            <ParsedText text={group.name} />
                        </h4>

                        <div class="collection-objects">
                            {#each group.things as things}
                                {#if thingType === 'npc'}
                                    <CollectionThingPet
                                        {things}
                                    />
                                {:else}
                                    <CollectionThing
                                        {things}
                                    />
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
