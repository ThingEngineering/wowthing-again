<script lang="ts">
    import { afterUpdate } from 'svelte';

    import getSavedRoute from '@/utils/get-saved-route';

    import Category from './Category.svelte';
    import Sidebar from './Sidebar.svelte';

    export let params: { slug: string };

    afterUpdate(() => getSavedRoute('reputations', params.slug));
</script>

<div class="view">
    <Sidebar />
    {#if params.slug}
        <Category slug={params.slug} />
    {/if}
</div>
