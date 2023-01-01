<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './ProfessionsSidebar.svelte'
    import View from './ProfessionsView.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => {
        getSavedRoute('professions', params.slug1)
    })
</script>

<Sidebar />

{#if params.slug1}
    <View slug={params.slug1} />
{/if}
