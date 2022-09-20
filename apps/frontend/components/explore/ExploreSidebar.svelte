<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Achievements',
            slug: 'achievements',
        },
    ]
</script>

<Sidebar
    baseUrl="/explore"
    items={categories}
    width="12rem"
>
</Sidebar>
