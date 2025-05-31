<script lang="ts">
    import { lazyStore, manualStore } from '@/stores';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { UserCount } from '@/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Settings from '@/components/common/SidebarCollectingSettings.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    let overall: UserCount;
    $: {
        categories = $manualStore.zoneMaps.sets.map((set) =>
            set === null
                ? null
                : {
                      children: set.slice(1),
                      ...set[0],
                  },
        );
        overall = $lazyStore.zoneMaps.counts['OVERALL'];
    }

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        return $lazyStore.zoneMaps.counts[slug].percent;
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
            <ProgressBar title="Overall" have={overall.have} total={overall.total} />
        </div>

        <Settings />
    </svelte:fragment>
</Sidebar>
