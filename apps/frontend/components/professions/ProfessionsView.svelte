<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Equipment from './equipment/Equipment.svelte'
    import DragonflightKnowledge from './knowledge/DragonflightKnowledge.svelte'
    import KnowledgeV2 from './knowledge/KnowledgeV2.svelte';
    import Overview from './overview/ProfessionsOverview.svelte'
    import Recipes from './recipes/ProfessionsRecipes.svelte'

    export let params: MultiSlugParams
</script>

<div class="view">
    {#if params.slug1 === 'dragonflight-knowledge'}
        <DragonflightKnowledge />
    {:else if params.slug1.endsWith('-knowledge')}
        <KnowledgeV2 slug={params.slug1.replace('-knowledge', '')} />
    {:else if params.slug1 === 'equipment'}
        <Equipment slug={params.slug2} />
    {:else if params.slug1 === 'overview'}
        <Overview slug={params.slug2} />
    {:else if params.slug1 === 'recipes'}
        <Recipes slug1={params.slug2} slug2={params.slug3} />
    {/if}
</div>
