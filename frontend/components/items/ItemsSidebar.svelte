<script lang="ts">
    import type { SidebarItem } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

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
