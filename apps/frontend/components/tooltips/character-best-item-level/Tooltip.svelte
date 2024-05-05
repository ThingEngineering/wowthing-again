<script lang="ts">
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';
import { staticStore } from '@/shared/stores/static';
    import type { StaticDataCharacterSpecialization } from '@/shared/stores/static/types';
    import type { Character } from '@/types/character';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import getItemLevelQuality from '@/utils/get-item-level-quality';

    export let bestItemLevels: Record<number, string>
    export let character: Character

    let specializations: StaticDataCharacterSpecialization[]
    $: {
        specializations = Object.values($staticStore.characterSpecializations)
            .filter((spec) => spec.classId === character.classId)
        specializations.sort((a, b) => a.name.localeCompare(b.name))
    }
</script>

<style lang="scss">
    table {
        --padding: 2;

        width: auto;
    }
    .icon {
        --image-border-width: 1px;
        // --image-margin-top: -4px;

        @include cell-width(1.5rem, $paddingLeft: 0.1rem, $paddingRight: 0);
    }
    .name {
        @include cell-width(7rem);

        text-align: left;
    }
    .item-level {
        text-align: right;
    }
</style>

<div class="wowthing-tooltip">
    <h4>{character.name}</h4>
    <h5>Best Item Levels</h5>
    <table class="table-striped">
        <tbody>
            {#each specializations as specialization}
                {@const itemLevel = bestItemLevels[specialization.id]}
                <tr>
                    <td class="icon">
                        <SpecializationIcon
                            specId={specialization.id}
                        />
                    </td>
                    <td class="name">
                        {getGenderedName(specialization.name, character.gender)}
                    </td>
                    <td class="quality{getItemLevelQuality(parseFloat(itemLevel))}">
                        {itemLevel}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
