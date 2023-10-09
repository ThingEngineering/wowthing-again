<script lang="ts">
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'
    import { expansionOrder } from '@/data/expansion'
    import { isCraftingProfession } from '@/data/professions'

    let categories: SidebarItem[]
    $: {
        const children: SidebarItem[] = []
        for (const profession of Object.values($staticStore.professions)) {
            if (!isCraftingProfession[profession.id]) {
                continue
            }

            children.push({
                name: `:profession-${profession.id}: ${profession.name.split('|')[0]}`,
                slug: profession.slug,
            })
        }
        children.sort((a, b) => a.slug.localeCompare(b.slug))

        categories = []
        for (const expansion of expansionOrder) {
            categories.push({
                name: expansion.name,
                slug: expansion.slug,
                children,
            })
        }
}
</script>

<Sidebar
    baseUrl="/professions/recipes"
    items={categories}
    noVisitRoot={true}
    width="13rem"
/>
