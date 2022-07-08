<script lang="ts">
    import { userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import { InventorySlot } from '@/types/enums'
    import type { BackgroundImage, Character } from '@/types'

    import Configure from './CharactersPaperdollConfigure.svelte'
    import Equipped from './CharactersPaperdollEquipped.svelte'

    export let character: Character

    // TODO use character setting
    let selected = $settingsData.characters.defaultBackground || 1

    let backgroundImage: BackgroundImage
    let characterImage: string
    let filter: string
    $: {
        backgroundImage = $userStore.data.backgrounds[selected]
        characterImage = $userStore.data.images[`${character.id}-2`]

        if (backgroundImage) {
            const filterParts: string[] = []

            if (backgroundImage.defaultBrightness != 10) {
                filterParts.push(`brightness(${backgroundImage.defaultBrightness / 10})`)
            }
            if (backgroundImage.defaultSaturate != 10) {
                filterParts.push(`saturate(${backgroundImage.defaultSaturate / 10})`)
            }
            filter = filterParts.join(' ')
        }
    }

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
    .paperdoll {
        --scale: 0.9;

        background-color: $highlight-background;
        border-bottom-left-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
        height: 750px;
        margin: -1rem;
        position: relative;
        width: calc(100% + 2rem);

        &::before {
            background-image: var(--background-image);
            background-position: 50% 50%;
            background-size: cover;
            border-bottom-left-radius: $border-radius;
            border-bottom-right-radius: $border-radius;
            content: "";
            filter: var(--background-filter, unset);
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
        }

        &.race-6,  // Tauren
        &.race-28, // Highmountain Tauren
        &.race-32  // Kul Tiran
        {
            --scale: 0.75;
        }

        &.race-2,  // Orc
        &.race-36, // Mag'har Orc
        &.race-8,  // Troll
        &.race-31  // Zandalari Troll
        {
            --scale: 0.75;
        }

        &.race-10  // Blood Elf
        {
            --scale: 0.95;
        }

        &.race-4,  // Night Elf
        &.race-11, // Draenei
        &.race-27, // Nightborne
        &.race-30  // Lightforged Draenei
        {
            --scale: 0.8;
        }
    }
    .character-image {
        bottom: 110px;
        filter:
            drop-shadow(-2px -2px 2px rgba(0, 0, 0, 0.5))
            drop-shadow(-2px  2px 2px rgba(0, 0, 0, 0.5))
            drop-shadow( 2px -2px 2px rgba(0, 0, 0, 0.5))
            drop-shadow( 2px  2px 2px rgba(0, 0, 0, 0.5))
            saturate(1.2)
            brightness(1.2)
        ;
        left: 50%;
        position: absolute;
        transform: translateX(-50%) scale(var(--scale, 1.0));
        transform-origin: bottom;
    }
    .equipped {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

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
        gap: 0.8rem;
    }
    .attribution {
        position: absolute;
        bottom: -1px;
        right: -1px;
        background: $thing-background;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        padding: 0 0.4rem 0.2rem 0.4rem;
    }
</style>

<div
    class="paperdoll race-{character.raceId}"
    style:--background-image={backgroundImage ? `url(https://img.wowthing.org/backgrounds/${backgroundImage.filename})` : undefined}
    style:--background-filter={filter}
>
    {#if characterImage}
        <img
            alt="Character image for {character.name}"
            class="character-image drop-shadow"
            src="{characterImage}"
        >
    {/if}

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

    {#if backgroundImage}
        <div class="attribution border">
            {@html backgroundImage.attribution}
        </div>
    {/if}
</div>

{#if !$userStore.data.public}
    <Configure
        bind:selected
        {character}
    />
{/if}
