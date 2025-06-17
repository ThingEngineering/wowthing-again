<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './Sidebar.svelte';
    import Table from './Table.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('sets', params.slug1, params.slug2));
</script>

<div class="view">
    <Sidebar />
    <Table slug1={params.slug1} slug2={params.slug2} />
</div>
