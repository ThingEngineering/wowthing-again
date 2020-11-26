<script lang="ts">
    import CollectionGroup from './CollectionGroup.svelte'
    import {setContext} from 'svelte'
    import {writable} from 'svelte/store'

    export let thingType: string
    export let thingMap
    export let userHas
    export let section

    const hasStore = writable(0)
    const totalStore = writable(0)

    setContext("collection", { hasStore, totalStore })
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
    section:not(:first-child) {
        margin-top: 1rem;
    }
</style>

<section>
    {#if section.Name}
        <h3>{section.Name} <span>[ <em>{$hasStore}</em> / <em>{$totalStore}</em> ]</span></h3>
    {/if}
    {#each section.Groups as group}
        <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
    {/each}
</section>
