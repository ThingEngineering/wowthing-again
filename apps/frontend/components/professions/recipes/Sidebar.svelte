<script lang="ts">
    import { isCraftingProfession } from '@/data/professions';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[];
    $: {
        const children: SidebarItem[] = [];
        for (const profession of wowthingData.static.professionById.values()) {
            if (!isCraftingProfession[profession.id]) {
                continue;
            }

            children.push({
                name: `:profession-${profession.id}: ${profession.name.split('|')[0]}`,
                slug: profession.slug,
            });
        }
        children.sort((a, b) => a.slug.localeCompare(b.slug));

        children.push(null);

        const cooking = wowthingData.static.professionBySlug.get('cooking');
        children.push({
            name: `:profession-${cooking.id}: ${cooking.name.split('|')[0]}`,
            slug: cooking.slug,
        });

        categories = [];
        for (const expansion of settingsState.expansions) {
            const expansionChildren = children.slice();

            const fishing = wowthingData.static.professionBySlug.get('fishing');
            const categoryChildren = fishing.expansionCategory[
                expansion.id
            ].children[0].children.filter((cat) => cat.abilities.length > 0);
            if (categoryChildren.length > 0) {
                expansionChildren.push({
                    name: `:profession-${fishing.id}: ${fishing.name.split('|')[0]}`,
                    slug: fishing.slug,
                });
            }

            categories.push({
                name: expansion.name,
                slug: expansion.slug,
                children: expansionChildren,
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
