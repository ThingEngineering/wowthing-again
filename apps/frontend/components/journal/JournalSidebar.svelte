<script lang="ts">
    import { wowthingData } from '@/shared/stores/data';
    import { lazyState } from '@/user-home/state/lazy';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { JournalDataTier } from '@/types/data';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Settings from '@/components/common/SidebarCollectingSettings.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getPercentClass from '@/utils/get-percent-class';

    let categories = $derived.by(
        () =>
            wowthingData.journal.tiers.map((tier: JournalDataTier) =>
                tier === null
                    ? null
                    : {
                          children: tier.subTiers
                              ? tier.subTiers
                                    .filter((subTier) => subTier.instances.length > 0)
                                    .map((subTier: JournalDataTier) =>
                                        subTier === null
                                            ? null
                                            : {
                                                  children: subTier.instances,
                                                  ...subTier,
                                              }
                                    )
                              : tier.instances,
                          ...tier,
                      }
            ) as SidebarItem[]
    );
    let overall = $derived(lazyState.journal.stats.OVERALL);

    const decorationFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        const hasData = lazyState.journal.stats[slug];
        const percent = hasData?.percent || 0;
        if (settingsState.value.collections.showRemaining) {
            if (hasData) {
                return `<span class="${getPercentClass(percent)}">${hasData.total - hasData.have}</span>`;
            } else {
                return '??';
            }
        } else {
            if (percent) {
                return `<span class="${getPercentClass(percent)}">${percent.toFixed(0)}%</span>`;
            } else {
                return '';
            }
        }
    };
</script>

<Sidebar
    baseUrl="/journal"
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="16rem"
    {decorationFunc}
>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar title="Overall" have={overall.have} total={overall.total} />
        </div>

        <Settings showRemaining={true} />
    </svelte:fragment>
</Sidebar>
