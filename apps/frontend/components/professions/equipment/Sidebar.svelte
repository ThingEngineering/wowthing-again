<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories = $derived.by(() => {
        const ret: SidebarItem[] = [
            {
                name: 'All',
                slug: 'all',
            },
            {
                name: 'Some',
                slug: 'some',
            },
            null,
        ];

        const sorted = sortBy(Array.from(wowthingData.static.professionById.values()), (prof) => [
            prof.type,
            prof.name,
        ]);

        for (const profession of sorted.filter((prof) => prof.type === 0)) {
            ret.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            });
        }

        ret.push(null);

        for (const profession of sorted.filter(
            (prof) => prof.type === 1 && prof.slug !== 'archaeology'
        )) {
            ret.push({
                name: profession.name.split('|')[0],
                slug: profession.slug,
            });
        }

        return ret;
    });
</script>

<style lang="scss">
</style>

<Sidebar baseUrl="/professions/equipment" items={categories} width="10rem"></Sidebar>
