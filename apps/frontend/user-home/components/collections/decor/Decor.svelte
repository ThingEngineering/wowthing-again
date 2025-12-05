<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import { wowthingData } from '@/shared/stores/data';
    import type { ParamsSlugsProps } from '@/types/props';

    import Category from './Category.svelte';
    import Sidebar from './Sidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    let category = $derived(
        wowthingData.static.decorCategories.find((cat) => cat.slug === params.slug1)
    );

    $effect(() => getSavedRoute('collections/decor', params.slug1));
</script>

<div class="view">
    <Sidebar />
    {#if category}
        <Category {category} />
    {/if}
</div>
