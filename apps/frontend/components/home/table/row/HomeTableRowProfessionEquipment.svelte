<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Constants } from '@/data/constants';
    import { imageStrings } from '@/data/icons';
    import { isCraftingProfession, professionIdToSlug } from '@/data/professions';
    import { wowthingData } from '@/shared/stores/data';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { getNumberKeys } from '@/utils/get-number-keyed-entries';
    import { getProfessionEquipment, getProfessionSortKey } from '@/utils/professions';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/professions/TooltipProfessions.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    let { character }: CharacterProps = $props();

    let primaryProfessions = $derived(
        sortBy(
            getNumberKeys(character.professions).filter(
                (professionId) => isCraftingProfession[professionId]
            ),
            (professionId) =>
                getProfessionSortKey(wowthingData.static.professionById.get(professionId))
        )
    );
</script>

<style lang="scss">
    td {
        border-left: 1px solid var(--border-color);
        padding-left: var(--padding-size);
        padding-right: var(--padding-size);
    }
    .flex-wrapper {
        // --image-margin-top: -4px !important;
    }
    .profession {
        align-items: center;
        display: flex;
        gap: 0.1rem;

        &:not(:first-child) {
            border-left: 1px solid var(--border-color);
            margin-left: var(--padding-size);
            padding-left: var(--padding-size);
        }
        > * {
            width: 1.2rem;
        }
    }
    .slot {
        border: 2px solid var(--image-border-color);
        border-radius: var(--border-radius);
        line-height: 1;
        padding: 2px 0;
        text-align: center;

        &:nth-child(2) {
            margin-left: 0.1rem;
        }
    }
</style>

<td>
    <div class="flex-wrapper">
        {#each primaryProfessions as professionId (professionId)}
            {@const equippedItems = getProfessionEquipment(character, professionId)}
            <div
                class="profession"
                use:componentTooltip={{
                    component: Tooltip,
                    propsFunc: () => ({
                        character,
                        profession: wowthingData.static.professionById.get(professionId),
                        showLevels: false,
                    }),
                }}
            >
                <WowthingImage
                    name={imageStrings[professionIdToSlug[professionId]]}
                    size={20}
                    border={1}
                />
                {#each { length: 3 }, index}
                    {@const equippedItem = equippedItems[index]}
                    {#if equippedItem}
                        {@const item = wowthingData.items.items[equippedItem.itemId]}
                        <div
                            class="slot {item?.expansion !== Constants.expansion
                                ? 'border-fail'
                                : `quality${equippedItem.quality}-border`}"
                        >
                            {equippedItem.craftedQuality}
                        </div>
                    {:else}
                        <YesNoIcon state={false} useStatusColors={true} />
                    {/if}
                {/each}
            </div>
        {/each}
    </div>
</td>
