<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { Character, MultiSlugParams } from '@/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    export let character: Character;
    export let params: MultiSlugParams;
    export let staticProfession: StaticDataProfession;

    let sidebarItems: SidebarItem[];
    $: {
        sidebarItems = settingsState.expansions.map((expansion) => {
            const subProfession = staticProfession?.expansionSubProfession?.[expansion.id];
            return {
                name: expansion.name,
                slug: expansion.slug,
                children:
                    subProfession?.traitTrees?.length > 0
                        ? [{ name: 'Traits', slug: 'traits' }]
                        : [],
            };
        });
    }

    const percentFunc = function (entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const characterProfession = character.professions[staticProfession.id];
        if (!characterProfession) {
            return 0;
        }

        let staticSubProfession =
            staticProfession.expansionSubProfession[
                expansionSlugMap[(parentEntries?.[0] || entry).slug].id
            ];

        const stats =
            parentEntries.length > 0
                ? characterProfession.subProfessionTraitStats[staticSubProfession?.id]
                : characterProfession.subProfessionStats[staticSubProfession?.id];
        return stats ? (stats.have / stats.total) * 100 : 0;
    };
</script>

{#key `character-professions-sidebar--${params.slug5}`}
    <Sidebar
        baseUrl={`/characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`}
        id="character-professions-sidebar"
        items={sidebarItems}
        width="14rem"
        alwaysExpand={true}
        {percentFunc}
    >
        <slot name="after" slot="after" />
    </Sidebar>
{/key}
