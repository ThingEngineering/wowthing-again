<script lang="ts">
    import { getItemUrl } from '@/utils/get-item-url';
    import { getProfessionEquipment } from '@/utils/professions';
    import type { StaticDataProfession } from '@/shared/stores/static/types';
    import type { CharacterProps } from '@/types/props';

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = CharacterProps & { profession: StaticDataProfession };
    let { character, profession }: Props = $props();

    let equippedItems = $derived(getProfessionEquipment(character, profession.id));
    let length = $derived(
        profession.slug === 'fishing' ? 1 : profession.slug === 'cooking' ? 2 : 3
    );
</script>

<style lang="scss">
    .item-container {
        --image-border-width: 2px;
        --image-margin-top: 0;

        display: flex;
        gap: 0.2rem;
        justify-content: center;
    }
    .item {
        height: 52px;
        position: relative;
        width: 52px;
    }
    .item-level {
        bottom: 2px;
    }
    .crafted-quality {
        position: absolute;
        right: -2px;
        top: -2px;
    }
    .empty-slot {
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 52px;
    }
</style>

<div class="item-container">
    {#each { length }, index}
        {@const equippedItem = equippedItems[index]}
        {#if equippedItem}
            <div class="item quality{equippedItem.quality}">
                <a href={getItemUrl(equippedItem)}>
                    <WowthingImage name="item/{equippedItem.itemId}" size={48} border={2} />

                    <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                    {#if equippedItem.itemLevel > 40}
                        {@const craftedQuality = equippedItem.craftedQuality || 1}
                        <span class="crafted-quality quality{craftedQuality}">
                            <CraftedQualityIcon quality={craftedQuality} />
                        </span>
                    {/if}
                </a>
            </div>
        {:else}
            <div class="empty-slot border border-radius border-fail">
                {#if index === 0}
                    Tool
                {:else}
                    Acc
                {/if}
            </div>
        {/if}
    {/each}
</div>
