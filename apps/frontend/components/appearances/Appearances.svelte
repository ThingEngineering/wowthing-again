<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './AppearancesSidebar.svelte';
    import View from './AppearancesView.svelte';

    type Props = ParamsSlugsProps & { basePath?: string };
    let { basePath, params }: Props = $props();

    $effect(() =>
        getSavedRoute(basePath ? `${basePath}/appearances` : 'appearances', params.slug1)
    );
</script>

<div class="view">
    <Sidebar {basePath} />

    {#if params.slug1}
        <View {params} />
    {/if}
</div>
