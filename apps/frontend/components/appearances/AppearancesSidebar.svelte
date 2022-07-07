<script lang="ts">
    import { transmogStore, userTransmogStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = $transmogStore.data.sets.map((set) => set === null ? null : ({
            children: set.slice(1),
            ...set[0],
        }))

        overall = $userTransmogStore.data.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userTransmogStore.data.stats[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl="/appearances"
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
