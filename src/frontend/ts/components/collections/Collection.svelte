<script lang="ts">
    import {afterUpdate, setContext} from 'svelte'

    import CollectionSection from './CollectionSection.svelte'

    export let thingType: string
    export let thingMap
    export let userHas
    export let sets

    afterUpdate(() => {
        if (window.__tip) {
            window.__tip.watchElligibleElements();
        }
    })
</script>

<div>
    {#each sets as section}
        <CollectionSection thingType={thingType} thingMap={thingMap} userHas={userHas} section={section} />
    {/each}
</div>
