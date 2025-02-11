<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Instance from './JournalInstance.svelte'
    import Sidebar from './JournalSidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => {
        getSavedRoute('journal', params.slug1, params.slug2, params.slug3)
    })
</script>

<Sidebar />
<Instance
    slug1={params.slug1}
    slug2={params.slug2}
    slug3={params.slug3}
/>
