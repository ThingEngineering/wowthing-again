<script lang="ts">
    import { getContext } from 'svelte'

    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { UserCount } from '@/types'
    import type { CollectibleContext } from '@/types/contexts'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    export let sets: ManualDataSetCategory[][]

    const { route, stats } = getContext('collection') as CollectibleContext

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = sets.map((set) => set === null ? null : ({
            children: set.length > 1 ? set.slice(1) : [],
            ...set[0],
        }))

        overall = stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = stats[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<Sidebar
    baseUrl={`/${route}`}
    items={categories}
    scrollable={true}
    width="16rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />
    </div>
</Sidebar>
