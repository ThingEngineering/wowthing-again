<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'Missing Mounts',
                slug: 'missing-mounts',
            },
            {
                name: 'Missing Pets',
                slug: 'missing-pets',
            },
            {
                name: 'Missing Toys',
                slug: 'missing-toys',
            },
            null,
            {
                name: 'Extra Pets',
                slug: 'extra-pets',
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
