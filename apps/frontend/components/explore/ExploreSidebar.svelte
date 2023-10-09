<script lang="ts">
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Achievements',
            slug: 'achievements',
        },
        {
            name: 'Quests',
            slug: 'quests',
        },
    ]
</script>

<Sidebar
    baseUrl="/explore"
    items={categories}
    width="12rem"
>
</Sidebar>
