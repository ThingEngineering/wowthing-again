<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { lazyStore } from '@/stores';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { UserCount } from '@/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import Settings from '@/components/common/SidebarCollectingSettings.svelte';

    let categories: SidebarItem[];
    let overall: UserCount;
    $: {
        categories = wowthingData.manual.transmog.sets.map((set) =>
            set === null
                ? null
                : {
                      children: set.slice(1),
                      ...set[0],
                  },
        );

        overall = $lazyStore.transmog.stats['OVERALL'];
    }

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        return $lazyStore.transmog.stats[slug].percent;
    };
</script>

<Sidebar baseUrl="/sets" items={categories} scrollable={true} width="16rem" {percentFunc}>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar title="Overall" have={overall.have} total={overall.total} />
        </div>

        <Settings />
    </svelte:fragment>
</Sidebar>
