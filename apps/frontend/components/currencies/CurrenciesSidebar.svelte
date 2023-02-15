<script lang="ts">
    import { categoryChildren, categoryOrder } from '@/data/currencies'
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = categoryOrder.map((id) => id === 0 ? null : ({
           children: categoryChildren[id] || [],
           ...$staticStore.currencyCategories[id],
        }))
    }
</script>

<Sidebar
    alwaysExpand={true}
    baseUrl="/currencies"
    items={categories}
    width="12rem"
/>
