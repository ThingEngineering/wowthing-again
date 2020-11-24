<script lang="ts">
    import CollectionThing from './CollectionThing.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let group
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    article {
        margin: 0 0.75rem 0.75rem 0;
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    p {
        margin: 0;
    }
</style>

<article>
    <p>{group.Name}</p>
    {#each group.Things as things}
        <CollectionThing thingType={thingType} thingMap={thingMap} userHas={userHas} things={things} />
    {/each}
</article>
