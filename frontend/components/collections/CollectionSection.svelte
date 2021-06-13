<script lang="ts">
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import {getContext} from 'svelte'

    import {data as userData} from '@/stores/user'
    import type {StaticDataSetCategory} from '@/types'

    import CollectionCount from './CollectionCount.svelte'
    import CollectionGroup from './CollectionGroup.svelte'

    export let slug: string

    const {
        route,
        sets,
        thingMap,
        thingType,
        userHas
    } = getContext('collection')

    let sections: StaticDataSetCategory[]
    $: sections = filter(find(sets, (s) => s !== null && s[0].Slug === slug), (s) => s.Groups.length > 0)
</script>

<style lang="scss">
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
        font-size: 1.0rem;
        font-weight: normal;
        margin-left: 0.5rem;
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem 0 0 0.75rem;
    }
</style>

{#each sections as section}
    <div class="section thing-container">
        {#if section.Name}
            <h3>{section.Name} <span><CollectionCount counts={$userData.setCounts[route][`${slug}_${section.Slug}`]} /></span></h3>
        {/if}
        <div class="container">
            {#each section.Groups as group, i (`${thingType}-${slug}-${i}`)}
                <CollectionGroup {thingType} {thingMap} {userHas} {group} />
            {/each}
        </div>
    </div>
{/each}
