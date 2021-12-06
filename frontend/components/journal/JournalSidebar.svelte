<script lang="ts">
    import { journalStore } from '@/stores'
    import type { SidebarItem } from '@/types'
    import type { JournalDataTier } from '@/types/data'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $journalStore.data.tiers.map((tier: JournalDataTier) => ({
            children: tier.instances.map((instance) => ({
                name: instance.name,
                slug: instance.slug,
            })),
            name: tier.name,
            slug: tier.slug,
        }))
    }


    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $journalStore.data.stats[slug]
        return hasData.have / hasData.total * 100
    }
</script>

<Sidebar
    baseUrl="/journal"
    items={categories}
    width="18rem"
    noVisitRoot={true}
    {percentFunc}
/>
