<script lang="ts">
    import { expansionOrder } from '@/data/expansion'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    export let params: MultiSlugParams
</script>

<Sidebar
    baseUrl={`/characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`}
    id="character-professions-sidebar"
    items={expansionOrder.filter((expansion) => expansion.id < 100)}
    width="12rem"
/>
