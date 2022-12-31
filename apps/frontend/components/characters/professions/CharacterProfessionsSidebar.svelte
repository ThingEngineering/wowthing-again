<script lang="ts">
    import { Constants } from '@/data/constants'
    import { expansionOrder } from '@/data/expansion'
    import type { MultiSlugParams, SidebarItem, UserCount } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    export let params: MultiSlugParams
    export let stats: Record<number, UserCount>

    const percentFunc = function(entry: SidebarItem): number {
        const cat = stats[Constants.expansion - entry.id]
        return cat ? cat.have / cat.total * 100 : 0
    }
</script>

<Sidebar
    baseUrl={`/characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`}
    id="character-professions-sidebar"
    items={expansionOrder.filter((expansion) => expansion.id < 100)}
    width="14rem"
    {percentFunc}
/>
