<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { expansionSlugMap } from '@/data/expansion';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import ProgressBar from '@/components/common/ProgressBar.svelte';
    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let sidebarItems = $derived.by(() => {
        const ret = [];
        const byExpansion: Record<number, Record<number, boolean>> = {};

        const sortedExpansions = settingsState.expansions.slice();
        const sortedProfessions = sortBy(
            Array.from(wowthingData.static.professionById.values()).filter(
                (prof) => prof.type === 0 || prof.slug === 'cooking' || prof.slug === 'fishing'
            ),
            (prof) => [prof.type, prof.name]
        );

        for (const profession of sortedProfessions) {
            const professionSidebarItem: SidebarItem = {
                name: profession.name.split('|')[0],
                slug: profession.slug,
                children: [],
            };

            for (const expansion of sortedExpansions) {
                if (userState.recipes.stats[`${profession.slug}--${expansion.slug}`]?.total > 0) {
                    (byExpansion[expansion.id] ||= {})[profession.id] = true;
                    professionSidebarItem.children.push(expansion);
                }
            }

            ret.push(professionSidebarItem);
        }

        ret.push(null);

        for (const expansion of sortedExpansions.filter((expansion) => byExpansion[expansion.id])) {
            const expansionSidebarItem: SidebarItem = {
                name: expansion.name,
                slug: expansion.slug,
                children: [],
            };

            for (const profession of sortedProfessions.filter(
                (prof) => byExpansion[expansion.id][prof.id]
            )) {
                expansionSidebarItem.children.push({
                    name: profession.name.split('|')[0],
                    slug: profession.slug,
                });
            }

            ret.push(expansionSidebarItem);
        }
        return ret;
    });

    let overall = $derived(userState.recipes.stats.OVERALL);

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        if (parentEntries?.length > 0) {
            const key = expansionSlugMap[parentEntries[0].slug]
                ? [entry.slug, ...parentEntries.map((parent) => parent.slug)].join('--')
                : [...parentEntries.map((parent) => parent.slug), entry.slug].join('--');
            return userState.recipes.stats[key]?.percent ?? 0;
        } else {
            if (expansionSlugMap[entry.slug]) {
                return userState.recipes.stats[`expansion--${entry.slug}`]?.percent ?? 0;
            } else {
                return userState.recipes.stats[entry.slug]?.percent ?? 0;
            }
        }
    };
</script>

<Sidebar
    baseUrl="/collections/recipes"
    id="character-recipes-sidebar"
    items={sidebarItems}
    width="16rem"
    noVisitRoot={true}
    scrollable={true}
    {percentFunc}
>
    <svelte:fragment slot="before">
        <div>
            <ProgressBar title="Overall" have={overall.have} total={overall.total} />
        </div>
    </svelte:fragment>
</Sidebar>
