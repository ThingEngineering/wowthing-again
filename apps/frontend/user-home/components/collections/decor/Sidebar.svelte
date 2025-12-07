<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import SubSidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { userState } from '@/user-home/state/user';
    import { lazyState } from '@/user-home/state/lazy';

    let sidebarItems = $derived(
        wowthingData.static.decorCategories.filter(
            (cat) => cat.subCategories.reduce((a, b) => a + b.objects.length, 0) > 0
        )
    );

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        return lazyState.decor[entry.slug]?.percent ?? 0;
    };
</script>

<SubSidebar
    baseUrl="/collections/decor"
    items={sidebarItems}
    width="12rem"
    scrollable={false}
    {percentFunc}
/>
