<script lang="ts">
    import { achievementStore, userStore } from '@/stores'
    import type {AchievementDataCategory} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'
    import SidebarEntry from '@/components/sidebar/SidebarEntry.svelte'

    let categories: AchievementDataCategory[]
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

    const percentFunc = function(entry: SidebarEntry): number {
        const cat = $userStore.data.achievementCategories[entry.id]
        return cat.have / cat.total * 100
    }
</script>

<Sidebar
    baseUrl="/achievements"
    items={categories}
    width="17rem"
    linkColor="#64e1ff"
    percentFunc={percentFunc}
/>
