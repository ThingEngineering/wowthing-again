<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { expansionMap } from '@/data/expansion'
    import { appearanceStore } from '@/stores'
    import type { SidebarItem, UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    let stats: UserCount
    $: {
        categories = [
            {
                name: 'Expansion',
                slug: 'expansion',
                children: sortBy(
                    Object.values(expansionMap),
                    (expansion) => 100 - expansion.id
                ),
            },
            null,
            {
                name: 'Cloth',
                slug: 'cloth',
                children: slots,
            },
            {
                name: 'Leather',
                slug: 'leather',
                children: slots,
            },
            {
                name: 'Mail',
                slug: 'mail',
                children: slots,
            },
            {
                name: 'Plate',
                slug: 'plate',
                children: slots,
            },
        ]
        stats = $appearanceStore.data.stats['OVERALL']
    }

    const percentFunc = function(entry: SidebarItem, parentEntry?: SidebarItem) {
        if (!parentEntry && entry.name === 'Expansion') {
            return -1
        }

        const slug = parentEntry ? `${parentEntry.slug}--${entry.slug}` : entry.slug
        const hasData = $appearanceStore.data.stats[slug]
        return (hasData?.have ?? 0) / (hasData?.total ?? 1) * 100
    }

    const slots: SidebarItem[] = [
        {
            name: 'Head',
            slug: 'head',
        },
        {
            name: 'Shoulders',
            slug: 'shoulders',
        },
        {
            name: 'Chest',
            slug: 'chest',
        },
        {
            name: 'Wrist',
            slug: 'wrist',
        },
        {
            name: 'Hands',
            slug: 'hands',
        },
        {
            name: 'Waist',
            slug: 'waist',
        },
        {
            name: 'Legs',
            slug: 'legs',
        },
        {
            name: 'Feet',
            slug: 'feet',
        },
    ]
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl="/appearances"
    items={categories}
    noVisitRoot={true}
    width="16rem"
    {percentFunc}
>
    <div slot="before">
        <ProgressBar
            title="Overall"
            have={stats.have}
            total={stats.total}
        />
    </div>
</Sidebar>
