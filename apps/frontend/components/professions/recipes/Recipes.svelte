<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import { wowthingData } from '@/shared/stores/data';
    import getSavedRoute from '@/utils/get-saved-route';

    import Sidebar from './Sidebar.svelte';
    import View from './View.svelte';

    let { slug1, slug2 }: { slug1: string; slug2: string } = $props();

    let expansion = $derived(expansionSlugMap[slug1]);
    let profession = $derived(wowthingData.static.professionBySlug.get(slug2));

    $effect(() => getSavedRoute('professions/recipes', slug1, slug2));
</script>

<Sidebar />
{#if expansion && profession}
    <View {expansion} {profession} />
{/if}
