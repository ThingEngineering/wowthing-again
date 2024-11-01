<script lang="ts">
    import { afterUpdate, type ComponentType } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Achievements from './ExploreAchievements.svelte'
    import BonusIDs from './ExploreBonusIDs.svelte';
    import Icons from './ExploreIcons.svelte';
    import Quests from './ExploreQuests.svelte'
    import Sidebar from './ExploreSidebar.svelte'
    import Transmog from './ExploreTransmog.svelte';

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('explore', params.slug1))

    const componentMap: Record<string, ComponentType> = {
        'achievements': Achievements,
        'bonus-ids': BonusIDs,
        'icons': Icons,
        'quests': Quests,
        'transmog': Transmog,
    }
</script>

<Sidebar />
<svelte:component this={componentMap[params.slug1]} />
