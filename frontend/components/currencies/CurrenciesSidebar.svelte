<script lang="ts">
    import { link } from 'svelte-spa-router'
    import active from 'svelte-spa-router/active'

    import { categoryOrder } from '@/data/currencies'
    import { staticStore } from '@/stores/static'
    import type {SidebarItem} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = categoryOrder.map((id) => ({
           children: [],
           ...$staticStore.data.currencyCategories[id],
        }))
    }
</script>


<Sidebar
    baseUrl="/currencies"
    items={categories}
    width="12rem"
/>
