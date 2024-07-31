<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static'
    import { lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let sidebarItems: SidebarItem[]
    $: {
        const children = settingsStore.expansions
            .map((expansion) => ({
                name: expansion.name,
                slug: expansion.slug,
            }))
        
        sidebarItems = []
        
        const sorted = sortBy(
            Object.values($staticStore.professions),
            (prof) => [prof.type, prof.name]
        )

        for (const profession of sorted.filter((prof) => prof.type === 0 || prof.slug === 'cooking')) {
            sidebarItems.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
                children: children.filter((child) => $lazyStore.recipes.stats[`${profession.slug}--${child.slug}`]?.total > 0),
            })
        }
    }
    $: overall = $lazyStore.recipes.stats.OVERALL;

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const key = [...parentEntries.map((parent) => parent.slug), entry.slug].join('--')
        const cat = $lazyStore.recipes.stats[key]
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
>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar
                title="Overall"
                have={overall.have}
                total={overall.total}
            />
        </div>
    </svelte:fragment>
</Sidebar>
