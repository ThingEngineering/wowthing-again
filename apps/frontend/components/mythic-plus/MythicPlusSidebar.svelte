<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { seasonMap } from '@/data/mythic-plus'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { MythicPlusSeason } from '@/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    const seasons: MythicPlusSeason[] = sortBy(seasonMap, (s) => -s.id)
    let categories: SidebarItem[]
    $: {
        categories = [
            {
                name: 'This Week',
                slug: 'this-week',
            },
            null,
        ].concat(seasons)
    }
</script>

<Sidebar
    baseUrl="/mythic-plus"
    items={categories}
    width="9rem"
/>
