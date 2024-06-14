<script lang="ts">
    import { manualStore } from '@/stores'
    import { lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Settings from '@/components/common/SidebarCollectingSettings.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $manualStore.vendors.sets.map((cat) => cat === null ? null : ({
            children: cat.slice(1),
            ...cat[0],
        }))

        overall = $lazyStore.vendors.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.vendors.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<Sidebar
    baseUrl="/vendors"
    items={categories}
    scrollable={true}
    width="16rem"
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

        <Settings />
    </svelte:fragment>
</Sidebar>
