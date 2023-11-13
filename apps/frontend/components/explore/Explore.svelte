<script lang="ts">
    import { afterUpdate, type ComponentType } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Achievements from './ExploreAchievements.svelte'
    import Quests from './ExploreQuests.svelte'
    import Sidebar from './ExploreSidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('explore', params.slug1))

    const componentMap: Record<string, ComponentType> = {
        'achievements': Achievements,
        'quests': Quests,
    }
</script>

<Sidebar />
<svelte:component
    this={componentMap[params.slug1]}
/>
