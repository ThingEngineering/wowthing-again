<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        categories = [
            {
                name: 'Missing Mounts',
                slug: 'missing-mounts',
                forceWildcard: true,
            },
            {
                name: 'Missing Pets',
                slug: 'missing-pets',
                forceWildcard: true,
            },
            {
                name: 'Missing Toys',
                slug: 'missing-toys',
                forceWildcard: true,
            },
            null,
            {
                name: 'Missing Appearance IDs',
                slug: 'missing-appearance-ids',
                forceWildcard: true,
            },
            {
                name: 'Missing Appearance Sources',
                slug: 'missing-appearance-sources',
                forceWildcard: true,
            },
            {
                name: 'Missing Recipes',
                slug: 'missing-recipes',
                forceWildcard: true,
            },
            null,
            {
                name: 'Commodities',
                slug: 'commodities',
            },
            {
                name: 'Extra Pets',
                slug: 'extra-pets',
                forceWildcard: true,
            },
        ];

        if (settingsState.value.auctions.customCategories?.length > 0) {
            categories.push(null);
            for (
                let catIndex = 0;
                catIndex < settingsState.value.auctions.customCategories.length;
                catIndex++
            ) {
                categories.push({
                    name: settingsState.value.auctions.customCategories[catIndex].name,
                    slug: `custom-${catIndex + 1}`,
                    forceWildcard: true,
                });
            }
        }
    }
</script>

<Sidebar baseUrl="/auctions" items={categories} width="14rem"></Sidebar>
