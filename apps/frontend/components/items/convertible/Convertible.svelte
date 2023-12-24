<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { characterClassBySlug } from '@/data/character-class'
    import getSavedRoute from '@/utils/get-saved-route'

    import ClassItems from './ClassItems.svelte'
    import DifficultyItems from './DifficultyItems.svelte'
    import Sidebar from './Sidebar.svelte'

    export let slug1: string
    export let slug2: string

    afterUpdate(() => getSavedRoute('items/convertible', slug1, slug2))
</script>

<div class="view">
    <Sidebar />

    {#if slug1 && slug2}
        {#if characterClassBySlug[slug2]}
            <ClassItems
                seasonSlug={slug1}
                classSlug={slug2}
            />
        {:else}
            <DifficultyItems
                seasonSlug={slug1}
                difficultySlug={slug2}
            />
        {/if}
    {/if}
</div>
