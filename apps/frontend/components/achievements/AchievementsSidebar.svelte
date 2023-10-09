<script lang="ts">
    import { achievementStore, userAchievementStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

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
            ...$achievementStore.categories,
        ]
    }

    const percentFunc = function(entry: SidebarItem): number {
        const cat = $userAchievementStore.achievementCategories[entry.id]
        return cat ? cat.have / cat.total * 100 : 0
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl="/achievements"
    items={categories}
    scrollable={true}
    width="17rem"
    percentFunc={percentFunc}
/>
