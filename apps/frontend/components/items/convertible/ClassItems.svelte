<script lang="ts">
    import find from 'lodash/find'

    import { convertibleCategories } from './data'
    import { AppearanceModifier } from '@/enums/appearance-modifier'
    import { staticStore } from '@/shared/stores/static'

    import ClassTable from './ClassTable.svelte'

    export let seasonSlug: string
    export let classSlug: string

    $: season = find(convertibleCategories, (cc) => cc.slug === seasonSlug)
    $: playerClass = $staticStore.characterClassesBySlug[classSlug]
</script>

<div class="wrapper-column">
    {#each [AppearanceModifier.Mythic, AppearanceModifier.Heroic, AppearanceModifier.Normal, AppearanceModifier.LookingForRaid] as modifier}
        <ClassTable
            {modifier}
            {playerClass}
            {season}
        />
    {/each}
</div>
