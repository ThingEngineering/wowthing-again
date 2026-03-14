<script lang="ts">
    import { isSecondaryProfession } from '@/data/professions';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories: SidebarItem[] = $derived.by(() => {
        const ret: SidebarItem[] = [];

        for (const expansion of settingsState.expansions) {
            const children: SidebarItem[] = [];
            for (const staticProfession of wowthingData.static.professionById.values()) {
                if (isSecondaryProfession[staticProfession.id]) {
                    continue;
                }

                const categoryChildren =
                    staticProfession.expansionCategory?.[
                        expansion.id
                    ]?.children[0]?.children?.filter((cat) => cat.abilities.length > 0) || [];
                if (categoryChildren.length > 0) {
                    children.push({
                        name: `:profession-${staticProfession.id}: ${staticProfession.name.split('|')[0]}`,
                        slug: staticProfession.slug,
                    });
                }
            }

            children.sort((a, b) => a.slug.localeCompare(b.slug));

            children.push(null);

            const cooking = wowthingData.static.professionBySlug.get('cooking');
            children.push({
                name: `:profession-${cooking.id}: ${cooking.name.split('|')[0]}`,
                slug: cooking.slug,
            });

            const fishing = wowthingData.static.professionBySlug.get('fishing');
            const categoryChildren = fishing.expansionCategory[
                expansion.id
            ].children[0].children.filter((cat) => cat.abilities.length > 0);
            if (categoryChildren.length > 0) {
                children.push({
                    name: `:profession-${fishing.id}: ${fishing.name.split('|')[0]}`,
                    slug: fishing.slug,
                });
            }

            ret.push({
                name: expansion.name,
                slug: expansion.slug,
                children,
            });
        }

        return ret;
    });
</script>

<Sidebar
    baseUrl="/professions/recipes"
    items={categories}
    noVisitRoot={true}
    scrollable={true}
    width="13rem"
/>
