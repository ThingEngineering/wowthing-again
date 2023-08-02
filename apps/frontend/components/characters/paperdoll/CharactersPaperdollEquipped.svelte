<script lang="ts">
    import { itemStore, staticStore } from '@/stores'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character } from '@/types'
    import type { InventorySlot } from '@/enums'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import { getEnchantmentText } from '@/utils/get-enchantment-text';

    export let character: Character
    export let inventorySlot: InventorySlot
    export let leftSide = false

    $: equippedItem = character.equippedItems[inventorySlot]
    $: item = $itemStore.items[equippedItem?.itemId]
</script>

<style lang="scss">
    .item {
        align-items: flex-end;
        display: flex;
        gap: 0.3rem;
    }
    .item-icon {
        --image-border-width: 2px;
        --shadow-color: rgba(0, 0, 0, 0.9);

        height: calc(56px + (2 * var(--image-border-width)));
        width: calc(56px + (2 * var(--image-border-width)));

        a {
            display: block;
            position: relative;
        }
        .empty-slot {
            background: rgba(0, 0, 0, 0.2);
            border-width: var(--image-border-width);
            height: 100%;
            width: 100%;
        }
        .pill {
            bottom: 2px;
        }    
    }
    .item-text {
        display: flex;
        flex-direction: column-reverse;
        height: 60px;
        justify-content: space-around;
        padding-right: 0.1rem;

        span {
            background-color: rgba(0, 0, 0, 0.75);
            padding: 0 3px 1px 3px;
        }
    }
</style>

<div
    class="item"
    style:flex-direction={leftSide ? 'row-reverse' : 'row'}
>
    <div
        class="item-icon"
        class:drop-shadow={equippedItem}
    >
        {#if equippedItem}
            <a class="quality{equippedItem.quality}" href={getItemUrl(equippedItem)}>
                <WowthingImage
                    name="item/{equippedItem.itemId}"
                    size={56}
                    border={2}
                />
                <span class="pill abs-center">{equippedItem.itemLevel}</span>
            </a>
        {:else}
            <div class="empty-slot border"></div>
        {/if}
    </div>

    {#if equippedItem}
        <div
            class="item-text"
            style:align-items={leftSide ? 'flex-end' : 'flex-start'}
        >
            <span class="quality{equippedItem.quality}">{item.name}</span>
            
            {#if equippedItem.enchantmentIds?.length > 0}
                {@const enchantId = equippedItem.enchantmentIds[0]}
                <span>
                    <ParsedText
                        cls="quality2"
                        text={getEnchantmentText(enchantId, $staticStore.enchantments[enchantId])}
                    />
                </span>
            {/if}
        </div>
    {/if}
</div>
