<script lang="ts">
    import { isCraftingProfession } from '@/data/professions';
    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        const children: SidebarItem[] = [];
        for (const profession of Object.values($staticStore.professions)) {
            if (!isCraftingProfession[profession.id]) {
                continue;
            }

            children.push({
                name: `:profession-${profession.id}: ${profession.name.split('|')[0]}`,
                slug: profession.slug,
            });
        }
        children.sort((a, b) => a.slug.localeCompare(b.slug));

        const cooking = Object.values($staticStore.professions).find((p) => p.slug === 'cooking');
        children.push(null);
        children.push({
            name: `:profession-${cooking.id}: ${cooking.name.split('|')[0]}`,
            slug: cooking.slug,
        });

        categories = [];
        for (const expansion of settingsStore.expansions) {
            categories.push({
                name: expansion.name,
                slug: expansion.slug,
                children,
            });
        }
    }
</script>

<Sidebar
    baseUrl="/professions/recipes"
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="13rem"
/>
