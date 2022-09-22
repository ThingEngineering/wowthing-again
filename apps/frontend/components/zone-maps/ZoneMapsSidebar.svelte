<script lang="ts">
    import { manualStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = $manualStore.data.zoneMaps.sets.map((set) => set === null ? null : ({
            children: set.slice(1),
            ...set[0],
        }))
        overall = $manualStore.data.zoneMaps.counts['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $manualStore.data.zoneMaps.counts[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl="/zone-maps"
    items={categories}
    width="16rem"
    noVisitRoot={true}
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
