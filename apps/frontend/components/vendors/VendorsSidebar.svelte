<script lang="ts">
    import { manualStore } from '@/stores'
    import { lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Settings from '@/components/common/SidebarCollectingSettings.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    $: overall = $lazyStore.vendors.stats['OVERALL']

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry]
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.vendors.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<Sidebar
    baseUrl="/vendors"
    items={$manualStore.vendors.sets}
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
