<script lang="ts">
    import sortBy from 'lodash/sortBy'

    import { expansionMap, expansionOrderMap } from '@/data/expansion'
    import { lazyStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { UserCount } from '@/types'

    import ProgressBar from '@/components/common/ProgressBar.svelte'
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'
    import { weaponSubclassOrder, weaponSubclassToString } from '@/data/weapons'

    export let basePath = ''

    let categories: SidebarItem[] = []
    let stats: UserCount
    $: {
        categories = [
            {
                name: 'Expansion',
                slug: 'expansion',
                children: sortBy(
                    Object.values(expansionMap),
                    (expansion) => expansionOrderMap[expansion.id]
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
            null,
            {
                name: 'Weapons',
                slug: 'weapons',
                children: weaponChildren,
            }
        ]
        stats = $lazyStore.appearances.OVERALL
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]) {
        if (parentEntries?.length < 1 && entry.name === 'Expansion') {
            return -1
        }

        const slug = [...parentEntries, entry].slice(-2)
            .map((entry) => entry.slug)
            .join('--')
        const hasData = $lazyStore.appearances[slug]
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

    const weaponChildren: SidebarItem[] = weaponSubclassOrder
        .map((subClass) => ({
            name: weaponSubclassToString[subClass],
            slug: weaponSubclassToString[subClass].toLowerCase().replace(/ /g, '-'),
        }))
</script>

<style lang="scss">
    div {
        margin-bottom: 0.75rem;
    }
</style>

<Sidebar
    baseUrl={basePath ? `/${basePath}/appearances` : '/appearances'}
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
