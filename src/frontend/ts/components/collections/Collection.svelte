<script lang="ts">
    import CollectionSection from './CollectionSection.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let sets
</script>

<div>
    {#each sets as section}
        <CollectionSection thingType={thingType} thingMap={thingMap} userHas={userHas} section={section} />
    {/each}
</div>
