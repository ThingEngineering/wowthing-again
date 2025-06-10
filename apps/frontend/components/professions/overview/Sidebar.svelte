<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        categories = [
            {
                name: 'All',
                slug: 'all',
            },
            {
                name: 'Collectors',
                slug: 'collectors',
            },
            null,
        ];

        const sorted = sortBy(Array.from(wowthingData.static.professionById.values()), (prof) => [
            prof.type,
            prof.name,
        ]);

        for (const profession of sorted.filter((prof) => prof.type === 0)) {
            categories.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            });
        }
        categories.push(null);
        for (const profession of sorted.filter((prof) => prof.type === 1)) {
            categories.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            });
        }
    }
</script>

<style lang="scss">
</style>

<Sidebar baseUrl="/professions/overview" items={categories} width="10rem"></Sidebar>
