<script lang="ts">
    import find from 'lodash/find'

    import { expansionOrder } from '@/data/expansion'
    import { staticStore } from '@/stores'
    import type { Character, MultiSlugParams } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    export let character: Character
    export let params: MultiSlugParams
    $: {
        const profession = find($staticStore.data.professions, (prof) => prof.slug === params.slug4)
    }
</script>

<Sidebar
    baseUrl={`/characters/${params.slug1}/${params.slug2}/${params.slug3}/${params.slug4}`}
    id="character-professions-sidebar"
    items={expansionOrder.filter((expansion) => expansion.id < 100)}
    width="12rem"
/>
