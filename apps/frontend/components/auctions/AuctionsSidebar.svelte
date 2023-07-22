<script lang="ts">
    import { settingsStore } from '@/stores'
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
                name: 'Missing Transmog',
                slug: 'missing-transmog',
                forceWildcard: true,
            },
            null,
            {
                name: 'Extra Pets',
                slug: 'extra-pets',
                forceWildcard: true,
            },
        ]

        if ($settingsStore.auctions.customCategories?.length > 0) {
            categories.push(null)
            for (let catIndex = 0; catIndex < $settingsStore.auctions.customCategories.length; catIndex++) {
                categories.push({
                    name: $settingsStore.auctions.customCategories[catIndex].name,
                    slug: `custom-${catIndex + 1}`,
                    forceWildcard: true,
                })
            }
        }
    }
</script>

<Sidebar
    baseUrl={'/auctions'}
    items={categories}
    width="10rem"
>
</Sidebar>
