<script lang="ts">
    import {transmogStore} from '@/stores/transmog'
    import type {SidebarItem} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = $transmogStore.data.sets.map((set) => ({
            children: [],
            ...set[0],
        }))
        console.log('categories', categories)
    }

</script>

<Sidebar
    baseUrl="/transmog"
    items={categories}
    width="12rem"
    linkColor="#64e1ff"
/>
