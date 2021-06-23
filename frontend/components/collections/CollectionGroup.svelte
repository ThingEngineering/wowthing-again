<script lang="ts">
    import type { Dictionary, StaticDataSetGroup } from '@/types'

    import CollectionThing from './CollectionThing.svelte'

    export let thingType: string
    export let thingMap: Dictionary<number>
    export let userHas: Dictionary<number>
    export let group: StaticDataSetGroup
</script>

<style lang="scss">
    div {
        margin: 0 0.75rem 0.75rem 0;
    }
    p {
        margin: 0;
    }
</style>

<div>
    <p>{group.name}</p>
    {#each group.things as things}
        <CollectionThing {thingType} {thingMap} {userHas} {things} />
    {/each}
</div>
