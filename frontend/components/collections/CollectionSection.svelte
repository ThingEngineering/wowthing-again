<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import { getContext } from 'svelte'

    import { userStore } from '@/stores'
    import { collectionState } from '@/stores/local-storage'
    import getPercentClass from '@/utils/get-percent-class'
    import tippy from '@/utils/tippy'
    import type { StaticDataSetCategory } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import CollectionThing from './CollectionThing.svelte'
    import CollectionThingPet from './CollectionThingPet.svelte'
    import SectionTitle from './CollectionSectionTitle.svelte'

    export let slug1: string
    export let slug2: string

    const { route, sets, thingType } = getContext('collection') as CollectionContext

    let sections: StaticDataSetCategory[]
    $: {
        sections = filter(
            find(sets, (s) => s !== null && s[0].slug === slug1),
            (s) => s.groups.length > 0
        )
        if (slug2) {
            sections = filter(sections, (s) => s.slug === slug2)
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

        <!--
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
        -->
    </div>

    {#each sections as section}
        <div class="collection thing-container">
            {#if section.name}
                <SectionTitle
                    title={section.name}
                    count={$userStore.data.setCounts[route][`${slug1}--${section.slug}`]}
                />
            {/if}

            <div class="collection-section">
                {#each section.groups as group, i (`${thingType}--${slug1}--${section.slug}--${i}`)}
                    <div
                        class="collection-group"
                        style="width: calc({44 * group.things.length}px + {0.3 * group.things.length}em);"
                    >
                        <h4
                            class="drop-shadow text-overflow {getPercentClass($userStore.data.setCounts[route][`${slug1}--${section.slug}--${group.name}`])}"
                            use:tippy={group.name}
                        >{group.name}</h4>

                        <div class="collection-objects">
                            {#each group.things as things}
                                {#if thingType === 'npc'}
                                    <CollectionThingPet {things} />
                                {:else}
                                    <CollectionThing {things} />
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
