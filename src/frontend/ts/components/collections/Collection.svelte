<script lang="ts">
    import {afterUpdate, setContext} from 'svelte'

    import CollectionSection from './CollectionSection.svelte'
    import CollectionSidebar from './CollectionSidebar.svelte'

    export let slug: string
    export let route: string
    export let thingType: string
    export let thingMap
    export let userHas
    export let sets

    setContext("collection", {
        slug,
        route,
        thingType,
        thingMap,
        userHas,
        sets,
    })

    afterUpdate(() => {
        if (window.__tip) {
            window.__tip.watchElligibleElements()
        }
    })
</script>

<style lang="scss">
    .collections {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
    .sections {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>

<div class="collections">
    <CollectionSidebar />
    {#if slug}
        <div class="sections">
            <CollectionSection slug={slug} />
        </div>
    {/if}
</div>
