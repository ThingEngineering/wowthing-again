<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { ManualDataSetCategory } from '@/types/data/manual';
    import { getCollectibleContext } from './context';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    type Props = { forPets?: boolean; sets: ManualDataSetCategory[][] };
    let { forPets = false, sets }: Props = $props();

    let { route, stats } = getCollectibleContext();

    let overall = $derived(stats.OVERALL);
    let categories = $derived.by(() => {
        const ret: SidebarItem[] = [];

        if (forPets) {
            ret.push({ name: 'Search', slug: 'search' });
            ret.push({ name: 'Family Battler', slug: 'family-battler', forceWildcard: true });
            ret.push(null);
        }

        ret.push(
            ...sets.map((set) =>
                set === null
                    ? null
                    : {
                          children: set.length > 1 ? set.slice(1) : [],
                          ...set[0],
                      }
            )
        );

        return ret;
    });

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        if (entry.slug === 'search' || entry.slug === 'family-battler') {
            return -1;
        }

        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        const hasData = stats[slug];
        return (hasData.have / hasData.total) * 100;
    };
</script>

<Sidebar baseUrl={`/${route}`} items={categories} scrollable={true} width="16rem" {percentFunc}>
    <div slot="before">
        <ProgressBar title="Overall" have={overall.have} total={overall.total} />
    </div>
</Sidebar>
