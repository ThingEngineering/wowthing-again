<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { StaticDataProfession } from '@/shared/stores/static/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let { sortedProfessions }: { sortedProfessions: StaticDataProfession[] } = $props();

    let categories = $derived([
        {
            name: 'All',
            slug: 'all',
        },
        null,
        ...sortedProfessions.map((prof) => ({
            name: `:profession-${prof.id}: ${prof.name.split('|')[0]}`,
            slug: prof.slug,
        })),
    ] as SidebarItem[]);
</script>

<style lang="scss">
</style>

<Sidebar baseUrl="/professions/patron-orders" items={categories} width="10rem"></Sidebar>
