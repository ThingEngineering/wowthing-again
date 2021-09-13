<script lang="ts">
    import { getContext } from 'svelte'

    import {userStore} from '@/stores'
    import type { SidebarItem } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    const { route, sets } = getContext('collection') as CollectionContext

    let categories: SidebarItem[]
    $: {
        categories = sets.map((set) => set === null ? null : ({
            children: set.length > 1 ? set.slice(1) : [],
            ...set[0],
        }))
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userStore.data.setCounts[route][slug]
        return hasData.have / hasData.total * 100
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl={`/${route}`}
    items={categories}
    width="16rem"
    {percentFunc}
/>
