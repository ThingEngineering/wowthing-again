<script lang="ts">
    import { replace } from 'svelte-spa-router';

    import { sharedState } from '@/shared/state/shared.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: { params: MultiSlugParams } = $props();

    $effect(() => {
        if (sharedState.public) {
            replace('/');
        } else {
            getSavedRoute('settings', params.slug1, params.slug2);
        }
    });
</script>

{#if !sharedState.public}
    <Sidebar />
    <Routes {params} />
{/if}
