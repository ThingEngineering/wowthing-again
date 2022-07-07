<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'Missing Mounts',
                slug: 'missing-mounts',
                forceWildcard: true,
            },
            {
                name: 'Missing Pets',
                slug: 'missing-pets',
                forceWildcard: true,
            },
            {
                name: 'Missing Toys',
                slug: 'missing-toys',
                forceWildcard: true,
            },
            null,
            {
                name: 'Extra Pets',
                slug: 'extra-pets',
                forceWildcard: true,
            },
        ]
    }
</script>

<Sidebar
    baseUrl={'/auctions'}
    items={categories}
    width="10rem"
>
</Sidebar>
