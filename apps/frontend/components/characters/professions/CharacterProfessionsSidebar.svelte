<script lang="ts">
    import { Constants } from '@/data/constants'
    import { expansionSlugMap } from '@/data/expansion'
    import { settingsStore } from '@/shared/stores/settings'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { Character, MultiSlugParams } from '@/types'
    import type { StaticDataProfession } from '@/shared/stores/static/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'
    import { lazyStore } from '@/stores';

    export let character: Character
    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession

    let sidebarItems: SidebarItem[]
    $: {
        sidebarItems = settingsStore.expansions
            .map((expansion) => ({
                name: expansion.name,
                slug: expansion.slug,
            }))

        if (staticProfession) {
            for (let i = 0; i < sidebarItems.length; i++) {
                if (staticProfession.subProfessions[Constants.expansion - i]?.traitTrees) {
                    sidebarItems[i].children = [{
                        name: 'Traits',
                        slug: 'traits',
                    }]
                }
            }
        }
    }

    const percentFunc = function(entry: SidebarItem, parentEntries?: SidebarItem[]): number {
        const characterProfession = $lazyStore.characters[character.id].professions.professions[staticProfession.id]
        if (!characterProfession) { return 0 }

        let staticSubProfession = staticProfession
            .subProfessions[expansionSlugMap[(parentEntries?.[0] || entry).slug].id]

        const stats = parentEntries.length > 0
            ? characterProfession.subProfessions[staticSubProfession.id].traitStats
            : characterProfession.subProfessions[staticSubProfession.id].stats
        return stats ? stats.have / stats.total * 100 : 0
    }
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
