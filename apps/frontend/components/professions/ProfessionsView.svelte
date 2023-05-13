<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Knowledge from './knowledge/ProfessionsKnowledge.svelte'
    import Overview from './overview/ProfessionsOverview.svelte'

    export let params: MultiSlugParams
</script>

<div>
    {#if params.slug1 === 'dragonflight-knowledge'}
        <Knowledge />
    {:else if params.slug1 === 'overview'}
        <Overview slug={params.slug2} />
    {/if}
</div>
