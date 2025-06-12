<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Settings from '@/components/common/SidebarCollectingSettings.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { wowthingData } from '@/shared/stores/data';

    let categories = $derived.by(
        () =>
            wowthingData.manual.zoneMaps.sets.map((set) =>
                set === null
                    ? null
                    : {
                          children: set.slice(1),
                          ...set[0],
                      }
            ) as SidebarItem[]
    );
    let overall = $derived(lazyState.zoneMaps.counts.OVERALL);

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        return lazyState.zoneMaps?.counts[slug]?.percent || 0;
    };
</script>

<Sidebar
    baseUrl="/zone-maps"
    items={categories}
    width="16rem"
    noVisitRoot={true}
    scrollable={true}
    {percentFunc}
>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar title="Overall" have={overall?.have || 0} total={overall?.total || 0} />
        </div>

        <Settings />
    </svelte:fragment>
</Sidebar>
