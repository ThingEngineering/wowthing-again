<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import type {MythicPlusSeason, SidebarItem} from '@/types'
    import { seasonMap } from '@/data/dungeon'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    const seasons: MythicPlusSeason[] = sortBy(seasonMap, (s) => 1000 - s.id)
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
    width="8rem"
/>
