<script lang="ts">
    import { AppearanceModifier } from '@/enums/appearance-modifier'
    import { staticStore } from '@/shared/stores/static'

    import type { ConvertibleCategory } from './types';

    import ClassTable from './ClassTable.svelte'

    export let classSlug: string
    export let season: ConvertibleCategory

    $: playerClass = $staticStore.characterClassesBySlug[classSlug]
</script>

<style lang="scss">
    div {
        :global(td.realm) {
            @include cell-width(9rem);
        }
    }
</style>

<div class="wrapper-column">
    {#each [AppearanceModifier.Mythic, AppearanceModifier.Heroic, AppearanceModifier.Normal, AppearanceModifier.LookingForRaid] as modifier}
        <ClassTable
            {modifier}
            {playerClass}
            {season}
        />
    {/each}
</div>
