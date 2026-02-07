<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import ProgressSidebar from './ProgressSidebar.svelte';
    import ProgressTable from './ProgressTable.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => {
        getSavedRoute('progress', params.slug1, params.slug2);
    });
</script>

<div class="view">
    <ProgressSidebar />
    {#if params.slug1}
        <ProgressTable slug1={params.slug1} slug2={params.slug2} />
    {/if}
</div>
