<script lang="ts">
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'Blacksmithing',
                slug: 'blacksmithing',
                children: [
                    {
                        name: 'Dragonflight',
                        slug: 'dragonflight',
                    },
                ],
            },
            null,
        ]
}
</script>

<Sidebar
    baseUrl="/professions/recipes"
    items={categories}
    width="10rem"
>
</Sidebar>
