<script lang="ts">
    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character, CharacterGear } from '@/types'

    import CraftedQualityIcon from '@/components/images/CraftedQualityIcon.svelte'
    import IconifyIcon from '../images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let forceCrafted = false
    export let gear: Partial<CharacterGear>
    export let tierPieces: number[]
    export let useHighlighting = false
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

        :global(.quality3 .item-level) {
            filter: brightness(120%);
        }
        :global(.quality4 .item-level) {
            filter: brightness(120%);
        }
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
    .crafted-quality {
        position: absolute;
        right: -2px;
        top: -2px;
    }
</style>

<td
    class="gear"
    class:no-problem={useHighlighting && !gear.highlight}
>
    {#if gear.equipped !== undefined}
        <a
            class="quality{gear.equipped.quality}"
            href={getItemUrl(gear.equipped, character, tierPieces)}>
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
        {:else if gear.equipped.craftedQuality > 0 || forceCrafted}
            <div class="crafted-quality">
                <CraftedQualityIcon
                    quality={Math.max(1, gear.equipped.craftedQuality)}
                />
            </div>
        {/if}
    {/if}
</td>
