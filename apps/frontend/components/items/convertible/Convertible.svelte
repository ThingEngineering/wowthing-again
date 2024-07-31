<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { characterClassBySlug } from '@/data/character-class'
    import getSavedRoute from '@/utils/get-saved-route'

    import ClassItems from './ClassItems.svelte'
    import DifficultyItems from './DifficultyItems.svelte'
    import Sidebar from './Sidebar.svelte'
    import { convertibleCategories } from './data';

    export let slug1: string
    export let slug2: string

    $: season = convertibleCategories.find((cc) => cc.slug === slug1)

    afterUpdate(() => getSavedRoute('items/convertible', slug1, slug2))
</script>

<div class="view">
    <Sidebar />

    {#if slug1 && slug2}
        {#if characterClassBySlug[slug2]}
            <ClassItems
                {season}
                classSlug={slug2}
            />
        {:else}
            <DifficultyItems
                {season}
                difficultySlug={slug2}
            />
        {/if}
    {/if}
</div>
