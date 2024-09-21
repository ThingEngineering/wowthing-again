<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { staticStore } from '@/shared/stores/static'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'
    import { isCraftingProfession } from '@/data/professions';

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'All',
                slug: 'all',
            },
            null,
        ]

        const sorted = sortBy(
            Object.values($staticStore.professions),
            (prof) => [prof.type, prof.name]
        )

        for (const profession of sorted.filter((prof) => isCraftingProfession[prof.id])) {
            categories.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            })
        }
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
