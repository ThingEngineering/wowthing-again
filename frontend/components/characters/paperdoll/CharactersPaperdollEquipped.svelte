<script lang="ts">
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character, CharacterEquippedItem } from '@/types'
    import type { InventorySlot } from '@/types/enums'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let inventorySlot: InventorySlot

    let item: CharacterEquippedItem
    $: {
        item = character.equippedItems[inventorySlot]
    }
</script>

<style lang="scss">
    div {
        --image-border-width: 2px;

        height: 52px;
        width: 52px;
    }
    a {
        display: block;
        position: relative;
    }
    .empty-slot {
        background: rgba(0, 0, 0, 0.8);
        border-width: 2px;
    }
    .pill {
        bottom: 2px;
    }
</style>

<div>
    {#if item}
        <a class="quality{item.quality}" href={getItemUrl(item)}>
            <WowthingImage
                name="item/{item.itemId}"
                size={48}
                border={2}
            />
            <span class="pill">{item.itemLevel}</span>
        </a>
    {:else}
        <div class="empty-slot border"></div>
    {/if}
</div>
