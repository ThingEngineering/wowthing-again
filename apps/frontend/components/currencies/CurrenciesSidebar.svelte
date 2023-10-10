<script lang="ts">
    import { categoryChildren, categoryOrder } from '@/data/currencies'
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

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
