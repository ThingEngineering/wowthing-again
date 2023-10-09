<script lang="ts">
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import SubSidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    const categories: SidebarItem[] = [
        {
            name: 'Appearance IDs',
            slug: 'appearance-ids',
            forceWildcard: true,
        },
        {
            name: 'Appearance Sources',
            slug: 'appearance-sources',
            forceWildcard: true,
        },
        {
            name: 'Completed Quests',
            slug: 'completed-quests',
            forceWildcard: true,
        },
        {
            name: 'Illusions',
            slug: 'illusions',
            forceWildcard: true,
        },
        {
            name: 'Mounts',
            slug: 'mounts',
            forceWildcard: true,
        },
        {
            name: 'Toys',
            slug: 'toys',
            forceWildcard: true,
        },
    ]
</script>

<SubSidebar
    baseUrl=""
    items={categories}
    width="12rem"
/>
