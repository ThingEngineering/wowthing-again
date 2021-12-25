<script lang="ts">
    import { InventorySlot } from '@/types/enums'
    import type { Character } from '@/types'

    import Equipped from './CharactersPaperdollEquipped.svelte'

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
        background-color: $highlight-background;
        background-position: 45% 70%;
        background-size: calc(1600px * var(--scale, 0.85)), calc(1200px * var(--scale, 0.85));
        height: 700px;
        margin: -1rem;
        position: relative;
        width: calc(100% + 2rem);

        &.race-6, // Tauren
        &.race-28,// Highmountain Tauren
        &.race-32 // Kul Tiran
    {
            --scale: 0.75;
        }

        &.race-2, // Orc
        &.race-36,// Mag'har Orc
        &.race-8, // Troll
        &.race-31 // Zandalari Troll
        {
            --scale: 0.8;
        }
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
    class="character-image race-{character.raceId}"
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
