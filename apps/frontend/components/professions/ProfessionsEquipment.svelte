<script lang="ts">
    import { getItemUrl } from '@/utils/get-item-url'
    import { getProfessionEquipment } from '@/utils/professions'
    import type { Character } from '@/types'
    import type { StaticDataProfession} from '@/types/data/static'

    import CraftedQualityIcon from '@/components/images/CraftedQualityIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let profession: StaticDataProfession

    $: equippedItems = getProfessionEquipment(character, profession.id)
</script>

<style lang="scss">
    .item-container {
        --image-border-width: 2px;
        --image-margin-top: 0;

        display: flex;
        gap: 0.2rem;
        justify-content: center;
        margin-top: 1rem;
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
        border-width: var(--image-border-width);
        height: 52px;
        width: 52px;
    }
</style>

<div class="item-container">
    {#each Array(3) as _, index}
        {@const equippedItem = equippedItems[index]}
        {#if equippedItem}
            <div class="item quality{equippedItem.quality}">
                <a href="{getItemUrl(equippedItem)}">
                    <WowthingImage
                        name="item/{equippedItem.itemId}"
                        size={48}
                        border={2}
                    />
                    
                    <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                    {#if equippedItem.itemLevel > 300}
                        {@const craftedQuality = equippedItem.craftedQuality || 1}
                        <span class="crafted-quality quality{craftedQuality}">
                            <CraftedQualityIcon
                                quality={craftedQuality}
                            />
                        </span>
                    {/if}
                </a>
            </div>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    {/each}
</div>
