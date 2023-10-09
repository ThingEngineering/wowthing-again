<script lang="ts">
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'Gold',
                slug: 'gold',
            },
        ]
    }
</script>

<Sidebar
    baseUrl={'/history'}
    items={categories}
    width="8rem"
>
</Sidebar>
