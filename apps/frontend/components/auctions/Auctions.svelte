<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import { replace } from 'svelte-spa-router';

    import { sharedState } from '@/shared/state/shared.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Sidebar from './AuctionsSidebar.svelte';
    import View from './AuctionsView.svelte';

    export let params: MultiSlugParams;

    afterUpdate(() => getSavedRoute('auctions', params.slug1));

    onMount(() => {
        if (sharedState.public) {
            replace('/');
        }
    });
</script>

{#if !sharedState.public}
    <Sidebar />
    {#if params.slug1}
        <View {params} />
    {/if}
{/if}
