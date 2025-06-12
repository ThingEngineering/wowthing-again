<script lang="ts">
    import { weaponSubclassOrder, weaponSubclassToString } from '@/data/weapons';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { lazyState } from '@/user-home/state/lazy';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Settings from '@/components/common/SidebarCollectingSettings.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let { basePath = '' }: { basePath: string } = $props();

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
    ];

    const weaponChildren: SidebarItem[] = weaponSubclassOrder.map((subClass) => ({
        name: weaponSubclassToString[subClass],
        slug: weaponSubclassToString[subClass].toLowerCase().replace(/ /g, '-'),
    }));

    let categories = $derived([
        {
            name: 'Expansion',
            slug: 'expansion',
            children: settingsState.expansions,
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
        },
    ] as SidebarItem[]);
    let stats = $derived(lazyState.appearances.stats.OVERALL);

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]) {
        if (parentEntries?.length < 1 && entry.name === 'Expansion') {
            return -1;
        }

        const slug = [...parentEntries, entry]
            .slice(-2)
            .map((entry) => entry.slug)
            .join('--');
        const hasData = lazyState.appearances.stats[slug];
        return ((hasData?.have ?? 0) / (hasData?.total ?? 1)) * 100;
    };
</script>

<Sidebar
    baseUrl={basePath ? `/${basePath}/appearances` : '/appearances'}
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="16rem"
    {percentFunc}
>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar title="Overall" have={stats.have} total={stats.total} />
        </div>

        <Settings />
    </svelte:fragment>
</Sidebar>
