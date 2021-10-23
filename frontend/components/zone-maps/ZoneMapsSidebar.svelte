<script lang="ts">
    import {zoneMapStore} from '@/stores'
    import type {SidebarItem} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = $zoneMapStore.data.sets.map((set) => set === null ? null : ({
            children: set.slice(1),
            ...set[0],
        }))
    }

    /*const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $userTransmogStore.data.has[slug]
        return hasData.have / hasData.total * 100
    }*/
</script>

<Sidebar
    baseUrl="/zone-maps"
    items={categories}
    width="12rem"
    noVisitRoot={true}
/>
