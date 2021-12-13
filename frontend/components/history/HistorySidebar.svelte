<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

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
