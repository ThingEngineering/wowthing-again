<script lang="ts">
    import { professionIdToString } from '@/data/professions';
    import { ProfessionSubclass } from '@/enums';
    import { itemStore } from '@/stores'
    import type { Character, CharacterEquippedItem } from '@/types'
    import type { StaticDataProfession} from '@/types/data/static'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import { iconStrings } from '@/data/icons';

    export let character: Character
    export let profession: StaticDataProfession

    let equippedItems: Record<number, CharacterEquippedItem>
    $: {
        equippedItems = {}
        
        const professionSlug = professionIdToString[profession.id]
        for (let slot = 20; slot <= 25; slot++) {
            const equippedItem = character.equippedItems[slot]
            if (equippedItem) {
                const item = $itemStore.data.items[equippedItem.itemId]
                if (ProfessionSubclass[item.subclassId].toLowerCase() === professionSlug) {
                    equippedItems[(slot - 20) % 3] = equippedItem
                }
            }
        }
    }
</script>

<style lang="scss">
    .item-container {
        --image-border-width: 2px;
        --image-margin-top: 0;

        border-top: 1px solid $border-color;
        display: flex;
        gap: 0.2rem;
        justify-content: center;
        padding: 0.75rem 0;
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
        --scale: 1.2;

        background: rgba(0, 0, 0, 1);
        border-radius: 50%;
        position: absolute;
        right: -1px;
        top: -1px;
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
            {@const craftedQuality = equippedItem.craftedQuality || 1}
            <div class="item quality{equippedItem.quality}">
                <WowthingImage
                    name="item/{equippedItem.itemId}"
                    size={48}
                    border={2}
                />
                
                <span class="item-level pill abs-center">{equippedItem.itemLevel}</span>

                <span class="crafted-quality quality{craftedQuality}">
                    <IconifyIcon
                        icon={iconStrings[`circle${craftedQuality}`]}
                    />
                </span>
            </div>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    {/each}
</div>
