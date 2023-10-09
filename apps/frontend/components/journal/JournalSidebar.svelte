<script lang="ts">
    import { journalStore, lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { UserCount } from '@/types'
    import type { JournalDataTier } from '@/types/data'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Settings from '@/components/common/SidebarCollectingSettings.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $journalStore.tiers.map((tier: JournalDataTier) => tier === null ? null : ({
            children: tier.subTiers
                ? tier.subTiers
                    .filter((subTier) => subTier.instances.length > 0)
                    .map((subTier: JournalDataTier) => subTier === null ? null : ({
                        children: subTier.instances,
                        ...subTier,
                    }))
                : tier.instances,
            ...tier,
        }))

        overall = $lazyStore.journal.stats.OVERALL
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.journal.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;

        :global(fieldset) {
            margin-top: 0.5rem;
        }
    }
</style>

<Sidebar
    baseUrl="/journal"
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="16rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />
        
        <Settings />
    </div>
</Sidebar>
