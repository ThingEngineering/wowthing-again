<script lang="ts">
    import CollectionThing from './CollectionThing.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let group
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    div {
        margin: 0 0.75rem 0.75rem 0;
    }
    p {
        margin: 0;
    }
</style>

<div>
    <p>{group.Name}</p>
    {#each group.Things as things}
        <CollectionThing thingType={thingType} thingMap={thingMap} userHas={userHas} things={things} />
    {/each}
</div>
