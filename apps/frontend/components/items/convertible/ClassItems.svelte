<script lang="ts">
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { wowthingData } from '@/shared/stores/data';

    import type { ConvertibleCategory } from './types';

    import ClassTable from './ClassTable.svelte';

    let { classSlug, season }: { classSlug: string; season: ConvertibleCategory } = $props();

    let playerClass = $derived(wowthingData.static.characterClassBySlug.get(classSlug));

    const modifierOrder = [
        AppearanceModifier.Mythic,
        AppearanceModifier.Heroic,
        AppearanceModifier.Normal,
        AppearanceModifier.LookingForRaid,
    ];
</script>

<style lang="scss">
    div {
        :global(td.realm) {
            --width: 9rem;
        }
    }
</style>

<div class="wrapper-column">
    {#each modifierOrder as modifier (modifier)}
        <ClassTable {modifier} {playerClass} {season} />
    {/each}
</div>
