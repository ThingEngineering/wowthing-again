<script lang="ts">
    import CollectionGroup from './CollectionGroup.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let section
</script>

<style lang="scss">
    h3 {
        margin: 0;
        width: 100%;
    }
    section {
        display: flex;
        flex-wrap: wrap;
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
