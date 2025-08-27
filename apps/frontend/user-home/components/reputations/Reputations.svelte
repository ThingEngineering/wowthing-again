<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Category from './Category.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('reputations', params.slug1));
</script>

<div class="view">
    <Sidebar />
    {#if params.slug1}
        <Category slug={params.slug1} />
    {/if}
</div>
