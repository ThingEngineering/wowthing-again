<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'Search',
                slug: 'search',
            },
        ]
    }
</script>

<Sidebar
    baseUrl={'/items'}
    items={categories}
    width="8rem"
>
</Sidebar>
