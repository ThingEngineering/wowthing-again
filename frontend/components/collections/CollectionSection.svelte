<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import { getContext } from 'svelte'

    import { userStore } from '@/stores'
    import type { StaticDataSetCategory } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import CollectionCount from './CollectionCount.svelte'
    import CollectionThing from './CollectionThing.svelte'
    import CollectionThingPet from './CollectionThingPet.svelte'

    export let slug: string

    const { route, sets, thingMap, thingType, userHas } = getContext('collection') as CollectionContext

    let sections: StaticDataSetCategory[]
    $: sections = filter(
        find(sets, (s) => s !== null && s[0].slug === slug),
        (s) => s.groups.length > 0,
    )
</script>

<style lang="scss">
    .section {
        border: 1px solid $border-color;
    }
    .section + .section {
        margin-top: 1rem;
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
    span {
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
                <span>
                    <CollectionCount counts={$userStore.data.setCounts[route][`${slug}_${section.slug}`]} />
                </span>
            </h3>
        {/if}
        <div class="container">
            {#each section.groups as group, i (`${thingType}-${slug}-${i}`)}
                <div class="collection-group">
                    <p>{group.name}</p>
                    <div class="wrapper">
                        {#each group.things as things}
                            {#if thingType === 'npc'}
                                <CollectionThingPet {thingMap} {things} />
                            {:else}
                                <CollectionThing {thingType} {thingMap} {userHas} {things} />
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/each}
