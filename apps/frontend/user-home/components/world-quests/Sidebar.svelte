<script lang="ts">
    import { zoneData } from './data'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = zoneData.map((key) => {
        return key === null ? null : {
            id: key[0],
            name: key[1],
            slug: key[2],
        }
    })
</script>

<Sidebar
    alwaysExpand={true}
    baseUrl="/world-quests"
    items={categories}
    width="12rem"
/>
