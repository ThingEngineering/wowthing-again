<script lang="ts">
    import { achievementStore, lazyStore, userAchievementStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
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
    $: foo = $lazyStore.achievements

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
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={$userAchievementStore.achievementCategories[0].havePoints}
            total={$userAchievementStore.achievementCategories[0].totalPoints}
        />
    </div>
</Sidebar>
