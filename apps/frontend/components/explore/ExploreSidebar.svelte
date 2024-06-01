<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Achievements',
            slug: 'achievements',
        },
        {
            name: 'Quests',
            slug: 'quests',
        },
        {
            name: 'Transmog Sets',
            slug: 'transmog',
        },
    ]
</script>

<Sidebar
    baseUrl="/explore"
    items={categories}
    width="12rem"
>
</Sidebar>
