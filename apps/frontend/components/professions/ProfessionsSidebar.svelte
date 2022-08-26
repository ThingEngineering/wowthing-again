<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { staticStore } from '@/stores'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = []

        const sorted = sortBy(
            Object.values($staticStore.data.professions),
            (prof) => [prof.type, prof.name]
        )
        console.log(sorted)

        for (const profession of sorted.filter((prof) => prof.type === 0)) {
            categories.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            })
        }
        categories.push(null)
        for (const profession of sorted.filter((prof) => prof.type === 1 && prof.slug !== 'archaeology')) {
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
    baseUrl="/professions"
    items={categories}
    width="10rem"
>
</Sidebar>
