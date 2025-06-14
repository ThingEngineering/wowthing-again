<script lang="ts">
    import { tick } from 'svelte';

    import { userHistoryStore } from '@/stores';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Gold from './Gold.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: { params: MultiSlugParams } = $props();

    $effect.pre(() => {
        tick().then(() => getSavedRoute('history', params.slug1));
    });
</script>

<Sidebar />
{#await userHistoryStore.fetch()}
    L O A D I N G
{:then}
    {#if params.slug1 === 'gold'}
        <Gold />
    {/if}
{/await}
