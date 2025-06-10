<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { expansionSlugMap } from '@/data/expansion';
    import { wowthingData } from '@/shared/stores/data';
    import getSavedRoute from '@/utils/get-saved-route';

    import Sidebar from './Sidebar.svelte';
    import View from './View.svelte';

    export let slug1: string;
    export let slug2: string;

    $: expansion = expansionSlugMap[slug1];
    $: profession = wowthingData.static.professionBySlug.get(slug2);

    afterUpdate(() => getSavedRoute('professions/recipes', slug1, slug2));
</script>

<style lang="scss">
</style>

<Sidebar />
{#if expansion && profession}
    <View {expansion} {profession} />
{/if}
