<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { expansionOrder } from '@/data/expansion'
    import { staticStore } from '@/shared/stores/static'
    import { lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let sidebarItems: SidebarItem[]
    $: {
        const children = expansionOrder
            .filter((expansion) => expansion.id >= 0 && expansion.id < 100)
            .map((expansion) => ({
                name: expansion.name,
                slug: expansion.slug,
            }))
        
        sidebarItems = []
        
        const sorted = sortBy(
            Object.values($staticStore.professions),
            (prof) => [prof.type, prof.name]
        )

        for (const profession of sorted.filter((prof) => prof.type === 0)) {
            sidebarItems.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
                children,
            })
        }
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const key = [...parentEntries.map((parent) => parent.slug), entry.slug].join('--')
        const cat = $lazyStore.recipes[key]
        return cat?.percent ?? 0
    }
</script>

<Sidebar
    baseUrl={'/collections/recipes'}
    id="character-recipes-sidebar"
    items={sidebarItems}
    width="16rem"
    noVisitRoot={true}
    scrollable={true}
    {percentFunc}
/>
