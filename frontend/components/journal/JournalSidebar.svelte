<script lang="ts">
    import { journalStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'
    import type { JournalDataTier } from '@/types/data'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[] = []
    let overall: UserCount
    $: {
        categories = $journalStore.data.tiers.map((tier: JournalDataTier) => ({
            children: tier.instances.map((instance) => ({
                name: instance.name,
                slug: instance.slug,
            })),
            name: tier.name,
            slug: tier.slug,
        }))

        overall = $journalStore.data.stats['OVERALL']
    }


    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $journalStore.data.stats[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl="/journal"
    items={categories}
    width="18rem"
    noVisitRoot={true}
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={overall.have}
            total={overall.total}
        />
    </div>
</Sidebar>
