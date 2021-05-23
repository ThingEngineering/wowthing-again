<script lang="ts">
    import {afterUpdate, setContext} from 'svelte'
    import {replace} from 'svelte-spa-router'

    import type {Dictionary, StaticDataSetCategory} from '../../types'

    import CollectionSection from './CollectionSection.svelte'
    import CollectionSidebar from './CollectionSidebar.svelte'

    export let slug: string
    export let route: string
    export let thingType: string
    export let thingMap: Dictionary<number>
    export let userHas: Dictionary<number>
    export let sets: StaticDataSetCategory[][]

    setContext("collection", {
        slug,
        route,
        thingType,
        thingMap,
        userHas,
        sets,
    })

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()

        const key = `route-${route}`
        if (slug === null) {
            const saved = localStorage.getItem(key)
            if (saved !== null) {
                replace(`/${route}/${saved}`)
            }
            else {
                const first = document.getElementById('sub-sidebar').querySelector('li a')
                replace(first.getAttribute('href').replace('#', ''))
            }
        }
        else {
            localStorage.setItem(key, slug)
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
