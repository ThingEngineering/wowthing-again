<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { expansionSlugMap } from '@/data/expansion';
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams
    
    let expansionSlug: string
    let professionSlug: string
    $: {
        if (expansionSlugMap[params.slug1]) {
            [expansionSlug, professionSlug] = [params.slug1, params.slug2];
        } else {
            [professionSlug, expansionSlug] = [params.slug1, params.slug2];
        }
    }

    afterUpdate(() => getSavedRoute('collections/recipes', params.slug1, params.slug2, 'character-recipes-sidebar'))
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1 && params.slug2}
        <div class="column-wrapper">
            <View {expansionSlug} {professionSlug} />
        </div>
    {/if}
</div>
