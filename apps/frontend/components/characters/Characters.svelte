<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './CharactersSidebar.svelte'
    import View from './CharactersView.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('characters', params.slug1, params.slug2))
</script>

<Sidebar />
<View {params} />
