<script lang="ts">
    import { afterUpdate } from 'svelte';

    import getSavedRoute from '@/utils/get-saved-route';

    import Category from './Category.svelte';
    import ScoreSummary from './ScoreSummary.svelte';
    import Sidebar from './Sidebar.svelte';

    export let params: {
        slug1: string;
        slug2: string;
    };

    afterUpdate(() => getSavedRoute('achievements', params.slug1, params.slug2));
</script>

<div class="view">
    <Sidebar />
    {#if params.slug1 === 'summary'}
        <ScoreSummary />
    {:else if params.slug1}
        <Category slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
