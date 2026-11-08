<script lang="ts">
    import { familyBattlerAchievements } from '@/data/achievements';
    import { getBasePathContext } from '@/shared/contexts/basePath';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import { generateFamilyBattlerData } from './family-battler-data';

    import FamilyBattlerAchievement from './FamilyBattlerAchievement.svelte';
    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let { slug }: { slug: string } = $props();

    const basePath = getBasePathContext();
    let baseUrl = basePath ? `/${basePath}/pets/family-battler` : '/pets/family-battler';

    let data = $derived(generateFamilyBattlerData());

    $effect(() => {
        getSavedRoute(baseUrl.slice(1), slug, null, null, 'family-battler-subnav');
    });

    const percentFunc = function (entry: SidebarItem): number {
        const cat = data[entry.slug]?.stats;
        return cat ? (cat.have / cat.total) * 100 : 0;
    };
</script>

<SubSidebar
    {baseUrl}
    id="family-battler-subnav"
    items={familyBattlerAchievements}
    width="16rem"
    {percentFunc}
/>
{#if slug}
    {@const familyBattle = data[slug]}
    {#if familyBattle}
        <FamilyBattlerAchievement {familyBattle} />
    {/if}
{/if}
