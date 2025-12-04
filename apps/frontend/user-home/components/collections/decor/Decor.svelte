<script lang="ts">
    import type { ParamsSlugsProps } from '@/types/props';
    import Sidebar from './Sidebar.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import SubCategory from './Category.svelte';

    let { params }: ParamsSlugsProps = $props();

    let category = $derived(
        wowthingData.static.decorCategories.find((cat) => cat.slug === params.slug1)
    );
</script>

<div class="view">
    <Sidebar />
    {#if category}
        <SubCategory {category} />
    {/if}
</div>
