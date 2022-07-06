<script lang="ts">
    import { achievementStore, userAchievementStore } from '@/stores'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = [
            {
                id: 0,
                name: 'Summary',
                slug: 'summary',
                children: [],
            },
            null,
            ...$achievementStore.data.categories,
        ]
    }

    const percentFunc = function(entry: SidebarItem): number {
        const cat = $userAchievementStore.data.achievementCategories[entry.id]
        return cat.have / cat.total * 100
    }
</script>

<Sidebar
    baseUrl="/achievements"
    items={categories}
    width="17rem"
    percentFunc={percentFunc}
/>
