<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Map from './Map.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('world-quests', params.slug1, params.slug2));
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1}
        <Map expansionSlug={params.slug1} mapSlug={params.slug2} />
    {/if}
</div>
