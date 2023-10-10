<script lang="ts">
    import { Constants } from '@/data/constants'
    import { expansionOrder } from '@/data/expansion'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'
    import type { MultiSlugParams, UserCount } from '@/types'
    import type { StaticDataProfession } from '@/stores/static/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    export let params: MultiSlugParams
    export let staticProfession: StaticDataProfession
    export let stats: Record<number, UserCount>

    let sidebarItems: SidebarItem[]
    $: {
        sidebarItems = expansionOrder
            .filter((expansion) => expansion.id >= 0 && expansion.id < 100)
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

    const percentFunc = function(entry: SidebarItem): number {
        const cat = stats[Constants.expansion - sidebarItems.indexOf(entry)]
        return cat ? cat.have / cat.total * 100 : 0
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
