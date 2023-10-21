<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Rename Requests',
            slug: 'rename-requests',
        },
    ]
</script>

<SubSidebar
    baseUrl=""
    items={categories}
    width="10rem"
/>
