<script lang="ts">
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Categories from './VendorsCategories.svelte';
    import Sidebar from './VendorsSidebar.svelte';

    let { params }: ParamsSlugsProps = $props();

    $effect(() => getSavedRoute('vendors', params.slug1, params.slug2, params.slug3));
</script>

<Sidebar />
<Categories {params} />
