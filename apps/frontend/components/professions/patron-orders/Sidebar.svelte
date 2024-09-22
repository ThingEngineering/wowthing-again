<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    export let sortedProfessions

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'All',
                slug: 'all',
            },
            null,
            ...sortedProfessions,
        ]
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl="/professions/patron-orders"
    items={categories}
    width="10rem"
>
</Sidebar>
