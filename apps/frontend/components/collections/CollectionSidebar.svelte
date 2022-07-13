<script lang="ts">
    import { getContext } from 'svelte'

    import { userStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'
    import type { CollectionContext } from '@/types/contexts'
    import type { ManualDataSetCategory } from '@/types/data/manual'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    const { route } = getContext('collection') as CollectionContext

    export let sets: ManualDataSetCategory[][]

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = sets.map((set) => set === null ? null : ({
            children: set.length > 1 ? set.slice(1) : [],
            ...set[0],
        }))

        overall = $userStore.data.setCounts[route]['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userStore.data.setCounts[route][slug]
        return hasData.have / hasData.total * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl={`/${route}`}
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
