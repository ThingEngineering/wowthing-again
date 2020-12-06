<script lang="ts">
    import find from 'lodash/find'
    import {getContext, setContext} from 'svelte'

    import CollectionGroup from './CollectionGroup.svelte'
    import {data as userData} from '../../stores/user-store'

    export let slug

    const {route, sets, thingMap, thingType, userHas} = getContext("collection")
    $: section = find(sets, (s) => s.Slug === slug)
    $: counts = $userData.setCounts[route][slug]
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

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
    }
    em {
        color: mix($body-text, #00ff00, 80%);
    }
    section {
        background: $thing-background;
        border: 1px solid $border-color;
        border-radius: $thing-border-radius;
        display: flex;
        flex-wrap: wrap;
    }
</style>

<section>
    {#if section.Name}
        <h3>{section.Name} <span>[ <em>{ counts.have }</em> / <em>{ counts.total }</em> ]</span></h3>
    {/if}
    {#each section.Groups as group, i (`${thingType}-${slug}-${i}`)}
        <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
    {/each}
</section>
