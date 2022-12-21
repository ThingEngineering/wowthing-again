<script lang="ts">
    import { bankBagSlots, characterBagSlots } from '@/data/inventory-slot'
    import { Constants } from '@/data/constants'
    import { staticStore, userStore } from '@/stores'
    import { gearState } from '@/stores/local-storage'
    import getCharacterGear from '@/utils/get-character-gear'
    import { getItemUrl } from '@/utils/get-item-url'
    import tippy from '@/utils/tippy'
    import type { Character, CharacterGear } from '@/types'

    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import IconifyIcon from '../images/IconifyIcon.svelte'
    import { iconStrings } from '@/data/icons'

    export let character: Character
    export let rowspan = 0

    let characterGear: CharacterGear[]
    let useHighlighting = false
    $: {
        character = character
        characterGear = getCharacterGear($gearState, character)
        useHighlighting = $gearState.highlightAny
    }
</script>

<style lang="scss">
    .gear {
        height: 44px;
        padding: 2px;
        position: relative;
        text-align: center;
        width: 46px;

        --image-border-width: 2px;
        --image-margin-top: 0;
    }
    .item-level {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        bottom: 3px;
        //color: #ffffff;
        font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
    .no-problem {
        > * {
            opacity: $inactive-opacity;
        }
    }
    .problems {
        --image-border-color: #ffff00;

        display: flex;
        height: 24px;
        justify-content: flex-end;
        opacity: 1;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: -2px;
        z-index: 1;
    }
    .icon {
        --image-margin-top: -2px;
        //--scale: 0.9;

        background: $thing-background;
        border: 2px solid var(--image-border-color);
        border-radius: $border-radius;
        color: $colour-success;
        display: flex;
        height: 24px;
        width: 24px;
    }
    .empty {
        background: $highlight-background;
        border: 2px solid $colour-fail;
        border-radius: $border-radius;
        display: flex;
        flex-direction: column;
        font-size: 0.9rem;
        height: 44px;
        justify-content: center;
        line-height: 1.1;
        opacity: 0.6;
        vertical-align: center;
        width: 44px;
        white-space: normal;
    }
</style>

{#each characterGear as gear}
    <td
        class="gear"
        class:no-problem={useHighlighting && !gear.highlight}
        rowspan="{rowspan > 0 ? rowspan : null}"
    >
        {#if gear.equipped !== undefined}
            <a class="quality{gear.equipped.quality}" href={getItemUrl(gear.equipped)}>
                <WowthingImage
                    name="item/{gear.equipped.itemId}"
                    size={40}
                    border={2}
                />
                <span class="item-level">{gear.equipped.itemLevel}</span>
            </a>

            {#if gear.highlight}
                <div class="problems">
                    {#if gear.missingEnchant}
                        <WowthingImage
                            name="{Constants.icons.enchant}"
                            size={20}
                            border={2}
                        />
                    {/if}

                    {#if gear.missingHeirloom}
                        <WowthingImage
                            name="{Constants.icons.gem}"
                            size={20}
                            border={2}
                        />
                    {/if}

                    {#if gear.missingGem}
                        <WowthingImage
                            name="{Constants.icons.gem}"
                            size={20}
                            border={2}
                        />
                    {/if}

                    {#if gear.missingUpgrade}
                        <div class="icon">
                            <IconifyIcon
                                icon={iconStrings['plus']}
                            />
                        </div>
                    {/if}
                </div>
            {/if}
        {/if}
    </td>
{/each}

{#if !$userStore.data.public}
    {#each [characterBagSlots, bankBagSlots] as bagSlots}
        <td class="spacer"></td>

        {#each bagSlots as bagSlot}
            {@const itemId = character.bags[bagSlot]}
            {@const bag = $staticStore.data.bags[itemId]}
            <td class="gear">
                {#if itemId && bag}
                    <a
                        class="quality{bag.quality}"
                        href="{getItemUrl({ itemId })}"
                    >
                        <WowthingImage
                            name="item/{itemId}"
                            size={40}
                            border={2}
                        />

                        <span class="item-level">{bag.slots}</span>
                    </a>
                {:else}
                    <div
                        class="empty"
                        use:tippy={"Empty bag slot"}
                    >
                        {#if bagSlot < 5}
                            Bag<br>{bagSlot}
                        {:else if bagSlot === 5}
                            Rea<br>gent
                        {:else}
                            Bank<br>{bagSlot - 5}
                        {/if}
                    </div>
                {/if}
            </td>
        {/each}
    {/each}
{/if}
