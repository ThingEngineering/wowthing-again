<script lang="ts">
    import find from 'lodash/find'
    import {getContext, setContext} from 'svelte'

    import CollectionCount from './CollectionCount.svelte'
    import CollectionGroup from './CollectionGroup.svelte'
    import {data as userData} from '../../stores/user-store'

    export let slug: string

    const {route, sets, thingMap, thingType, userHas} = getContext('collection')
    $: sections = find(sets, (s) => s !== null && s[0].Slug === slug)
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    .section {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;

        & + .section {
            margin-top: 1rem;
        }
    }
    h3 {
        margin: 0;
        padding: 0.25rem 0.5rem;
        width: 100%;
        background: $highlight-background;
        border-bottom: 1px solid $border-color;
        border-top-left-radius: $thing-border-radius;
        border-top-right-radius: $thing-border-radius;
    }
    span {
        font-size: 0.9rem;
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
    <div class="section">
        {#if section.Name}
            <h3>{section.Name} <span>[ <CollectionCount counts={$userData.setCounts[route][`${slug}_${section.Slug}`]} /> ]</span></h3>
        {/if}
        <div class="container">
            {#each section.Groups as group, i (`${thingType}-${slug}-${i}`)}
                <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
            {/each}
        </div>
    </div>
{/each}
