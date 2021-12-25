<script lang="ts">
    import { InventorySlot } from '@/types/enums'
    import type { Character } from '@/types'

    import Equipped from './CharactersGeneralEquipped.svelte'

    export let character: Character

    const leftSide: InventorySlot[] = [
        InventorySlot.Head,
        InventorySlot.Neck,
        InventorySlot.Shoulders,
        InventorySlot.Back,
        InventorySlot.Chest,
        InventorySlot.Shirt,
        InventorySlot.Tabard,
        InventorySlot.Wrist,
    ]
    const rightSide: InventorySlot[] = [
        InventorySlot.Hands,
        InventorySlot.Waist,
        InventorySlot.Legs,
        InventorySlot.Feet,
        InventorySlot.Ring1,
        InventorySlot.Ring2,
        InventorySlot.Trinket1,
        InventorySlot.Trinket2,
    ]
</script>

<style lang="scss">
    .character-image {
        --scale: 0.85;

        background-color: $highlight-background;
        background-position: 45% 55%;
        background-size: calc(1600px * var(--scale)), calc(1200px * var(--scale));
        height: 750px;
        position: relative;
        width: 1000px;
    }
    .equipped {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.left {
            left: 2rem;
        }
        &.right {
            right: 2rem;
        }
    }
    .weapons {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
    }
</style>

<div
    class="character-image"
    style="{character.renderUrl ? `background-image: url(${character.renderUrl})` : ''};"
>
    <div class="equipped left">
        {#each leftSide as inventorySlot}
            <Equipped
                {character}
                {inventorySlot}
            />
        {/each}
    </div>

    <div class="equipped right">
        {#each rightSide as inventorySlot}
            <Equipped
                {character}
                {inventorySlot}
            />
        {/each}
    </div>

    <div class="weapons">
        <Equipped
            inventorySlot={InventorySlot.MainHand}
            {character}
        />
        <Equipped
            inventorySlot={InventorySlot.OffHand}
            {character}
        />
    </div>
</div>
