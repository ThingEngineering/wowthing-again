<script lang="ts">
    import { manualStore } from '@/stores'
    import { userVendorStore } from '@/stores/user-vendors'
    import type { SidebarItem, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $manualStore.data.vendors.sets.map((cat) => cat === null ? null : ({
            children: cat.slice(1),
            ...cat[0],
        }))

        overall = $userVendorStore.data.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $userVendorStore.data.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl="/vendors"
    items={categories}
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
