<script lang="ts">
    import type { SidebarItem } from '@/types'

    import SubSidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Completed Quests',
            slug: 'completed-quests',
        },
    ]
</script>

<SubSidebar
    baseUrl=""
    items={categories}
    width="12rem"
/>
