<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Achievements from './ExploreAchievements.svelte';
    import BonusIDs from './ExploreBonusIDs.svelte';
    import Chett from './Chett.svelte';
    import Icons from './ExploreIcons.svelte';
    import Quests from './ExploreQuests.svelte';
    import Sidebar from './ExploreSidebar.svelte';
    import Transmog from './ExploreTransmog.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('explore', params.slug1));

    const componentMap = {
        achievements: Achievements,
        'bonus-ids': BonusIDs,
        chett: Chett,
        icons: Icons,
        quests: Quests,
        transmog: Transmog,
    };
</script>

<Sidebar />
<svelte:component this={componentMap[params.slug1 as keyof typeof componentMap]} />
