<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Options from './Options.svelte'
    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('collections/recipes', params.slug1, params.slug2, 'character-recipes-sidebar'))
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1 && params.slug2}
        <div class="column-wrapper">
            <Options />
            <View {params} />
        </div>
    {/if}
</div>
