<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './Sidebar.svelte';
    import View from './View.svelte';

    let { basePath = '', params }: { basePath?: string } & ParamsSlugsProps = $props();

    $effect(() =>
        getSavedRoute(
            basePath ? `${basePath}/customizations` : 'customizations',
            params.slug1,
            params.slug2
        )
    );
</script>

<div class="view">
    <Sidebar {basePath} />

    {#if params.slug1 && params.slug2}
        <View {params} />
    {/if}
</div>
