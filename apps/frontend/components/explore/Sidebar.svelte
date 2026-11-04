<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    const categories: SidebarItem[] = [
        {
            name: 'Achievements',
            slug: 'achievements',
        },
        {
            name: 'Bonus IDs',
            slug: 'bonus-ids',
        },
        {
            name: 'Icons',
            slug: 'icons',
        },
        {
            name: 'Modifier Trees',
            slug: 'modifier-trees',
        },
        {
            name: 'Transmog Sets',
            slug: 'transmog',
        },
        null,
        {
            name: 'CHETT',
            slug: 'chett',
        },
        {
            name: 'Quests',
            slug: 'quests',
        },
    ];
</script>

<Sidebar baseUrl="/explore" items={categories} width="12rem"></Sidebar>
