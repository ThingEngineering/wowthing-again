<script lang="ts">
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './Sidebar.svelte';
    import View from './View.svelte';

    let { params }: ParamsSlugsProps = $props();
</script>

<Sidebar />

{#if params.slug1}
    <View page={parseInt(params.slug2) || 0} slug={params.slug1} />
{/if}
