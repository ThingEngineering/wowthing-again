<script lang="ts">
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character, CharacterEquippedItem } from '@/types'
    import type { InventorySlot } from '@/enums'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let inventorySlot: InventorySlot

    let item: CharacterEquippedItem
    $: {
        item = character.equippedItems[inventorySlot]
    }
</script>

<style lang="scss">
    .equipped-item {
        --image-border-width: 2px;
        --shadow-color: rgba(0, 0, 0, 0.9);

        height: calc(56px + (2 * var(--image-border-width)));
        width: calc(56px + (2 * var(--image-border-width)));
    }
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
</style>

<div
    class="equipped-item"
    class:drop-shadow={item}
>
    {#if item}
        <a class="quality{item.quality}" href={getItemUrl(item)}>
            <WowthingImage
                name="item/{item.itemId}"
                size={56}
                border={2}
            />
            <span class="pill">{item.itemLevel}</span>
        </a>
    {:else}
        <div class="empty-slot border"></div>
    {/if}
</div>
