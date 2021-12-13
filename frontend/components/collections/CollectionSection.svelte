<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import { getContext } from 'svelte'

    import { userStore } from '@/stores'
    import getPercentClass from "@/utils/get-percent-class";
    import tippy from '@/utils/tippy'
    import type { StaticDataSetCategory } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import CollectionCount from './CollectionCount.svelte'
    import CollectionThing from './CollectionThing.svelte'
    import CollectionThingPet from './CollectionThingPet.svelte'

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
    .section {
        border: 1px solid $border-color;

        &:not(:last-child) {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
    .section + .section {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top-width: 0;
        //margin-top: 1rem;
    }
    h3 {
        margin: 0;
        padding: 0.25rem 0.5rem;
        width: 100%;
        background: $collection-background;
        border-bottom: 1px solid $border-color;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
        color: #ddd;
    }
    .counts {
        font-size: 1rem;
        font-weight: normal;
        margin-left: 0.5rem;
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem 0 0 0.75rem;
    }
    .collection-group {
        margin: 0 0.75rem 0.75rem 0;

        p {
            margin: 0 0 0.1rem 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .wrapper {
        align-items: flex-start;
        display: flex;
        justify-items: flex-start;
    }
</style>

{#each sections as section}
    <div class="section thing-container">
        {#if section.name}
            <h3>
                {section.name}
                <span class="counts">
                    <CollectionCount
                        counts={$userStore.data.setCounts[route][`${slug1}--${section.slug}`]}
                    />
                </span>
            </h3>
        {/if}
        <div class="container">
            {#each section.groups as group, i (`${thingType}--${slug1}--${section.slug}--${i}`)}
                <div
                    class="collection-group"
                    style="width: {(44 * group.things.length) + (3 * (group.things.length - 1))}px;"
                >
                    <p
                        class="drop-shadow {getPercentClass($userStore.data.setCounts[route][`${slug1}--${section.slug}--${group.name}`])}"
                        use:tippy={group.name}
                    >
                        {group.name}
                    </p>
                    <div class="wrapper">
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
