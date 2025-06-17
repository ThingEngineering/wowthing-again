<script lang="ts">
    import { expansionSlugMap } from '@/data/expansion';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { ParamsSlugsProps } from '@/types/props';

    import Sidebar from './Sidebar.svelte';
    import View from './View.svelte';

    let { params }: ParamsSlugsProps = $props();

    let expansionSlug = $derived(expansionSlugMap[params.slug1] ? params.slug1 : params.slug2);
    let professionSlug = $derived(expansionSlugMap[params.slug1] ? params.slug2 : params.slug1);

    $effect(() =>
        getSavedRoute(
            'collections/recipes',
            params.slug1,
            params.slug2,
            null,
            'character-recipes-sidebar'
        )
    );
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1 && params.slug2}
        <div class="column-wrapper">
            <View {expansionSlug} {professionSlug} />
        </div>
    {/if}
</div>
