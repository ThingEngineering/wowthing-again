<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Equipment from './equipment/Equipment.svelte'
    import Knowledge from './knowledge/ProfessionsKnowledge.svelte'
    import Overview from './overview/ProfessionsOverview.svelte'
    import Recipes from './recipes/ProfessionsRecipes.svelte'

    export let params: MultiSlugParams
</script>

<div class="view">
    {#if params.slug1 === 'dragonflight-knowledge'}
        <Knowledge />
    {:else if params.slug1 === 'equipment'}
        <Equipment />
    {:else if params.slug1 === 'overview'}
        <Overview slug={params.slug2} />
    {:else if params.slug1 === 'recipes'}
        <Recipes slug1={params.slug2} slug2={params.slug3} />
    {/if}
</div>
