<script lang="ts">
    import { journalStore } from '@/stores'
    import { settingsStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'
    import type { JournalDataTier } from '@/types/data'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'
    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

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

        overall = $journalStore.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $journalStore.stats[slug]
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
    width="16rem"
    noVisitRoot={true}
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />
        
        <Checkbox
            name="transmog_completionistMode"
            bind:value={$settingsStore.transmog.completionistMode}
        >Completionist Mode</Checkbox>
    </div>
</Sidebar>
