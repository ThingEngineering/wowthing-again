<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Knowledge from './knowledge/ProfessionsKnowledge.svelte'
    import Overview from './overview/ProfessionsOverview.svelte'
    import Recipes from './recipes/ProfessionsRecipes.svelte'

    export let params: MultiSlugParams
</script>

<div>
    {#if params.slug1 === 'dragonflight-knowledge'}
        <Knowledge />
    {:else if params.slug1 === 'overview'}
        <Overview slug={params.slug2} />
    {:else if params.slug1 === 'recipes'}
        <Recipes />
    {/if}
</div>
