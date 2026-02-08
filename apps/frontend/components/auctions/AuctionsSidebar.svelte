<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        categories = [
            {
                name: 'Buy Missing',
                slug: 'missing',
                forceNoVisit: true,
                children: [
                    {
                        name: 'Mounts',
                        slug: 'mounts',
                        forceWildcard: true,
                    },
                    {
                        name: 'Pets',
                        slug: 'pets',
                        forceWildcard: true,
                    },
                    {
                        name: 'Toys',
                        slug: 'toys',
                        forceWildcard: true,
                    },
                    null,
                    {
                        name: 'Appearance IDs',
                        slug: 'appearance-ids',
                        forceWildcard: true,
                    },
                    {
                        name: 'Appearance Sources',
                        slug: 'appearance-sources',
                        forceWildcard: true,
                    },
                    {
                        name: 'Decor',
                        slug: 'decor',
                        forceWildcard: true,
                    },
                    {
                        name: 'Recipes',
                        slug: 'recipes',
                        forceWildcard: true,
                    },
                ],
            },
            null,
            {
                name: 'Sell',
                slug: 'sell',
                forceNoVisit: true,
                children: [
                    {
                        name: 'Commodities',
                        slug: 'commodities',
                    },
                    {
                        name: 'Extra Pets',
                        slug: 'extra-pets',
                        forceWildcard: true,
                    },
                ],
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

<Sidebar baseUrl="/auctions" items={categories} width="14rem" />
