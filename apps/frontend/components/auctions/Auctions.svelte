<script lang="ts">
    import { onMount } from 'svelte';
    import { replace } from 'svelte-spa-router';

    import { sharedState } from '@/shared/state/shared.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './AuctionsSidebar.svelte';
    import View from './AuctionsView.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => {
        if (sharedState.public) {
            replace('/');
        } else {
            getSavedRoute('auctions', params.slug1);
        }
    });

    onMount(() => {});
</script>

{#if !sharedState.public}
    <Sidebar />
    {#if params.slug1}
        <View {params} />
    {/if}
{/if}
