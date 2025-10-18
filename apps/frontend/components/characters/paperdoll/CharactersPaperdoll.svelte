<script lang="ts">
    import { InventorySlot } from '@/enums/inventory-slot';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { sharedState } from '@/shared/state/shared.svelte';
    import { userStore } from '@/stores';
    import type { BackgroundImage, Character } from '@/types';

    import Configure from './CharactersPaperdollConfigure.svelte';
    import Equipped from './CharactersPaperdollEquipped.svelte';
    import Stats from './CharactersPaperdollStats.svelte';
    import { backgroundMap } from '@/data/backgrounds';

    export let character: Character;

    let selected = character.configuration.backgroundId;

    let backgroundImage: BackgroundImage;
    let characterImage: string;
    let filter: string;
    $: {
        backgroundImage =
            backgroundMap[
                selected === -1 ? settingsState.value.characters.defaultBackgroundId : selected
            ];
        characterImage = $userStore.images[`${character.id}-2`];

        if (backgroundImage) {
            const filterParts: string[] = [];

            const brightness =
                character.configuration.backgroundBrightness !== -1
                    ? character.configuration.backgroundBrightness
                    : backgroundImage.defaultBrightness;
            const saturation =
                character.configuration.backgroundSaturation !== -1
                    ? character.configuration.backgroundSaturation
                    : backgroundImage.defaultSaturate;

            if (brightness != 10) {
                filterParts.push(`brightness(${brightness / 10})`);
            }
            if (saturation != 10) {
                filterParts.push(`saturate(${saturation / 10})`);
            }
            filter = filterParts.join(' ');
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
    ];
    const rightSide: InventorySlot[] = [
        InventorySlot.Hands,
        InventorySlot.Waist,
        InventorySlot.Legs,
        InventorySlot.Feet,
        InventorySlot.Ring1,
        InventorySlot.Ring2,
        InventorySlot.Trinket1,
        InventorySlot.Trinket2,
    ];
</script>

<style lang="scss">
    .paperdoll {
        --scale: 0.9;

        background-color: var(--color-highlight-background);
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        height: 750px;
        position: relative;
        width: 100%;

        &::before {
            background-image: var(--background-image);
            background-position: 50% 50%;
            background-size: cover;
            border-bottom-left-radius: var(--border-radius);
            border-bottom-right-radius: var(--border-radius);
            content: '';
            filter: var(--background-filter, unset);
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
        }

        &.race-6,  // Tauren
        &.race-8,  // Troll
        &.race-28, // Highmountain Tauren
        &.race-31, // Zandalari Troll
        &.race-32  // Kul Tiran
        {
            --scale: 0.75;
        }

        &.race-10  // Blood Elf
        {
            --scale: 0.95;
        }

        &.race-2,  // Orc
        &.race-3,  // Dwarf
        &.race-4,  // Night Elf
        &.race-11, // Draenei
        &.race-27, // Nightborne
        &.race-30, // Lightforged Draenei
        &.race-35, // Vulpera
        &.race-36, // Mag'har Orc
        &.race-52, // Dracthyr [A]
        &.race-70  // Dracthyr [H]
        {
            --scale: 0.8;
        }
    }
    .paperdoll-configurable {
        border-bottom: 1px solid var(--border-color);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        margin-bottom: 0;

        .attribution {
            border-bottom-right-radius: 0;
        }
    }
    .character-image {
        bottom: 110px;
        filter: drop-shadow(-2px -2px 2px rgba(0, 0, 0, 0.5))
            drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.5))
            drop-shadow(2px -2px 2px rgba(0, 0, 0, 0.5)) drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))
            saturate(1.2) brightness(1.2);
        left: 50%;
        position: absolute;
        transform: translateX(-50%) scale(var(--scale, 1));
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
            left: 1rem;
        }
        &.right {
            right: 1rem;
        }
    }
    .weapon {
        bottom: 1rem;
        position: absolute;

        &.left {
            right: calc(50% + 0.5rem);
        }
        &.right {
            left: calc(50% + 0.5rem);
        }
    }
    .attribution {
        position: absolute;
        bottom: 0;
        right: -1px;
        transform: translateY(100%);
        background: var(--color-thing-background);
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        padding: 0 0.4rem 0.2rem 0.4rem;
    }
</style>

<div
    class="paperdoll race-{character.raceId}"
    class:paperdoll-configurable={!sharedState.public}
    style:--background-image={backgroundImage
        ? `url(https://img.wowthing.org/backgrounds/${backgroundImage.filename})`
        : undefined}
    style:--background-filter={filter}
>
    {#if characterImage}
        <img
            alt="Character image for {character.name}"
            class="character-image drop-shadow"
            src={characterImage}
        />
    {/if}

    <div class="equipped left">
        {#each leftSide as inventorySlot}
            <Equipped {character} {inventorySlot} />
        {/each}
    </div>

    <div class="equipped right">
        {#each rightSide as inventorySlot}
            <Equipped {character} {inventorySlot} leftSide={true} />
        {/each}
    </div>

    <div class="weapon left">
        <Equipped inventorySlot={InventorySlot.MainHand} {character} leftSide={true} />
    </div>

    <div class="weapon right">
        <Equipped inventorySlot={InventorySlot.OffHand} {character} />
    </div>

    {#if backgroundImage}
        <div class="attribution border">
            {@html backgroundImage.attribution}
        </div>
    {/if}

    <Stats {character} />
</div>

{#if !sharedState.public}
    <Configure
        bind:backgroundBrightness={character.configuration.backgroundBrightness}
        bind:backgroundSaturation={character.configuration.backgroundSaturation}
        bind:selected
        {character}
    />
{/if}
