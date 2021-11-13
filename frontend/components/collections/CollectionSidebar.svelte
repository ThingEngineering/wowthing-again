<script lang="ts">
    import { getContext } from 'svelte'

    import { userCollectionStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    const { route, sets } = getContext('collection') as CollectionContext

    let categories: SidebarItem[]
    let overall: UserCount
    $: {
        categories = sets.map((set) => set === null ? null : ({
            children: set.length > 1 ? set.slice(1) : [],
            ...set[0],
        }))

        overall = $userCollectionStore.data.setCounts[route]['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userCollectionStore.data.setCounts[route][slug]
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
