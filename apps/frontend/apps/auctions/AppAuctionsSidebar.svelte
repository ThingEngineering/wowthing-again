<script lang="ts">
    import active from 'svelte-spa-router/active'

    import { auctionStore } from '@/stores/auction'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'
    import type { SidebarItem } from '@/types/sidebar'

    let categories: SidebarItem[] = []
    $: {
        categories = $auctionStore.categories
        console.log(categories)
    }
</script>

<Sidebar
    baseUrl={'/browse'}
    items={categories}
    width={'16rem'}
>
</Sidebar>
