<script lang="ts">
    import { convertibleCategories } from './data';
    import { characterClassBySlug } from '@/data/character-class';
    import getSavedRoute from '@/utils/get-saved-route';

    import ClassItems from './ClassItems.svelte';
    import DifficultyItems from './DifficultyItems.svelte';
    import Sidebar from './Sidebar.svelte';

    let { slug1, slug2 }: { slug1: string; slug2: string } = $props();

    let season = $derived(convertibleCategories.find((cc) => cc.slug === slug1));

    $effect(() => getSavedRoute('items/convertible', slug1, slug2));
</script>

<div class="view">
    <Sidebar />

    {#if slug1 && slug2}
        {#if characterClassBySlug[slug2]}
            <ClassItems {season} classSlug={slug2} />
        {:else}
            <DifficultyItems {season} difficultySlug={slug2} />
        {/if}
    {/if}
</div>
