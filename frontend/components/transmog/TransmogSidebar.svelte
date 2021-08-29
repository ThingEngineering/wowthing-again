<script lang="ts">
    import {transmogStore, userTransmogStore} from '@/stores'
    import type {SidebarItem} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = $transmogStore.data.sets.map((set) => ({
            children: set.slice(1),
            ...set[0],
        }))
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userTransmogStore.data.has[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<Sidebar
    baseUrl="/transmog"
    items={categories}
    width="16rem"
    linkColor="#64e1ff"
    {percentFunc}
/>
