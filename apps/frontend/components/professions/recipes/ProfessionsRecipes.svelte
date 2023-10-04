<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { expansionSlugMap } from '@/data/expansion'
    import { professionSlugToId } from '@/data/professions'
    import { staticStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './ProfessionsRecipesSidebar.svelte'
    import View from './ProfessionsRecipesView.svelte'

    export let slug1: string
    export let slug2: string

    $: expansion = expansionSlugMap[slug1]
    $: profession = $staticStore.professions[professionSlugToId[slug2]]

    afterUpdate(() => getSavedRoute('professions/recipes', slug1, slug2))
</script>

<style lang="scss">
</style>

<Sidebar />
{#if expansion && profession}
    <View {expansion} {profession} />
{/if}
