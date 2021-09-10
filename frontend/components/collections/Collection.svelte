<script lang="ts">
    import { afterUpdate, setContext } from 'svelte'
    import { replace } from 'svelte-spa-router'

    import type { Dictionary, MultiSlugParams, StaticDataSetCategory } from '@/types'

    import CollectionSection from './CollectionSection.svelte'
    import CollectionSidebar from './CollectionSidebar.svelte'
    import type {CollectionContext} from '@/types/contexts'

    export let params: MultiSlugParams
    export let route: string
    export let thingType: string
    export let thingMap: Dictionary<number> = {}
    export let userHas: Dictionary<boolean> = {}
    export let sets: StaticDataSetCategory[][]

    const context: CollectionContext = {
        route,
        thingType,
        thingMap,
        userHas,
        sets,
    }
    setContext('collection', context)

    afterUpdate(() => {
        window.__tip?.watchElligibleElements()

        const key = `route-${route}`
        if (params.slug1 === null) {
            const saved = localStorage.getItem(key)
            if (saved !== null) {
                replace(`/${route}/${saved}`)
            }
            else {
                const first = document
                    .getElementById('sub-sidebar')
                    .querySelector('li a')
                replace(first.getAttribute('href').replace('#', ''))
            }
        }
        else {
            localStorage.setItem(key, params.slug2 ? `${params.slug1}/${params.slug2}` : params.slug1)
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
    <div class="sections">
        <CollectionSection slug1={params.slug1} slug2={params.slug2} />
    </div>
</div>
