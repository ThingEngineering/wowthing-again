<script lang="ts">
    import type { InventoryType } from '@/enums/inventory-type';
    import { inventoryTypeIcons } from '@/shared/icons/mappings';
    import { wowthingData } from '@/shared/stores/data';
    import { getGenderedName } from '@/utils/get-gendered-name';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { CharacterProps } from '@/types/props';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import SpecializationIcon from '@/shared/components/images/SpecializationIcon.svelte';

    type Props = CharacterProps & {
        bestItemLevels: Record<number, [string, InventoryType[]]>;
    };
    let { bestItemLevels, character }: Props = $props();

    let specializations = $derived.by(() => {
        const specs = wowthingData.static.characterSpecializationsByClassId.get(character.classId);
        specs.sort((a, b) => a.name.localeCompare(b.name));
        return specs;
    });
</script>

<style lang="scss">
    table {
        --padding: 2;

        width: auto;
    }
    .icon {
        --image-border-width: 1px;
        // --image-margin-top: -4px;
        --padding-left: 0.1rem;
        --padding-right: 0;
        --width: 1.5rem;
    }
    .name {
        --width: 7rem;

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
            {#each specializations as specialization (specialization.id)}
                {@const [itemLevel, missingSlots] = bestItemLevels[specialization.id] || ['0']}
                <tr>
                    <td class="icon">
                        <SpecializationIcon specId={specialization.id} />
                    </td>
                    <td class="name">
                        {getGenderedName(specialization.name, character.gender)}
                    </td>
                    <td class="quality{getItemLevelQuality(parseFloat(itemLevel))}">
                        {itemLevel}
                    </td>
                    <td class="slots status-warn">
                        {#each missingSlots as missingSlot (missingSlot)}
                            <IconifyIcon icon={inventoryTypeIcons[missingSlot]} />
                        {/each}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
