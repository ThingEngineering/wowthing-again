<script lang="ts">
    import CollectionGroup from './CollectionGroup.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let section
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    h3 {
        margin: 0;
        padding: 0.25rem 0.5rem;
        width: 100%;
        background: mix($thing-background, #0000ff, 90%);
        border-bottom: 1px solid $border-color;
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
        <h3>{section.Name}</h3>
    {/if}
    {#each section.Groups as group}
        <CollectionGroup thingType={thingType} thingMap={thingMap} userHas={userHas} group={group} />
    {/each}
</section>
