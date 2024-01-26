<script lang="ts">
    import { dfS3Aspect, dfS3Drake, dfS3Whelpling, dfS3Wyrm } from './convertible/data'
    import { Constants } from '@/data/constants'
    import { iconStrings } from '@/data/icons'
    import { itemStore } from '@/stores'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character, CharacterGear } from '@/types'

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let forceCrafted = false
    export let gear: Partial<CharacterGear>
    export let tierPieces: number[] = undefined
    export let useHighlighting = false
    export let useItemCount = false

    function getIconName(): [string, number] {
        let tiers: [number, number][][]
        for (const bonusId of gear.equipped.bonusIds) {
            if (!$itemStore.itemBonusCurrentSeason.has(bonusId)) {
                continue
            }

            const upgrade = $itemStore.itemBonusToUpgrade[bonusId]
            if (upgrade?.[0] > 0 && upgrade[1] < upgrade[2]) {
                if (upgrade[0] === Constants.upgradeTiers.explorer) {
                    tiers = [null, null]
                }
                else if (upgrade[0] === Constants.upgradeTiers.adventurer) {
                    tiers = [null, dfS3Whelpling]
                }
                else if (upgrade[0] === Constants.upgradeTiers.veteran) {
                    tiers = [dfS3Whelpling, dfS3Drake]
                }
                else if (upgrade[0] === Constants.upgradeTiers.champion) {
                    tiers = [dfS3Drake, dfS3Wyrm]
                }
                else if (upgrade[0] === Constants.upgradeTiers.hero) {
                    tiers = [dfS3Wyrm, dfS3Aspect]
                }
                else if (upgrade[0] === Constants.upgradeTiers.myth) {
                    tiers = [dfS3Aspect, null]
                }
                else {
                    console.log(upgrade)
                }

                if (upgrade[1] < 4 && tiers[0]) {
                    return [
                        `currency/${tiers[0][0][0]}`,
                        Math.floor((character.currencies?.[tiers[0][0][0]]?.quantity || 0) / tiers[0][0][1])
                    ]
                }
                else if (upgrade[1] >= 4 && tiers[1]) {
                    return [
                        `currency/${tiers[1][0][0]}`,
                        Math.floor((character.currencies?.[tiers[1][0][0]]?.quantity || 0) / tiers[1][0][1])
                    ]
                }
        
                return ['currency/2245', 0]
            }
        }

        return [null, 0]
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
        bottom: 1px;
        //color: #ffffff;
        font-size: 0.9rem;
        line-height: 1;
        padding: 0 2px 1px 2px;
        pointer-events: none;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;

        &.left {
            color: $body-text;
            font-size: 0.85rem;
            left: 3px;
            transform: none;
        }
        &.right {
            left: auto;
            right: 3px;
            transform: none;
        }
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
        --image-border-width: 0;

        background: $thing-background;
        border: 2px solid var(--image-border-color);
        border-radius: $border-radius;
        color: $color-success;
        display: flex;
        height: 24px;
        width: 24px;

        &.faded {
            --image-border-color: #bbb;
        }
    }
    .crafted-quality {
        pointer-events: none;
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
        {@const item = $itemStore.items[gear.equipped.itemId]}
        <a
            class="quality{gear.equipped.quality}"
            href={getItemUrl(gear.equipped, character, tierPieces)}
        >
            <WowthingImage
                name="item/{gear.equipped.itemId}"
                size={40}
                border={2}
            />
            
            {#if useItemCount}
                {#if item?.equippable}
                    <span class="item-level right">{gear.equipped.itemLevel}</span>
                {:else if (gear.equipped.count || 0) > 0}
                    <span class="item-level left">x{gear.equipped.count}</span>
                {/if}
            {:else}
                <span class="item-level">{gear.equipped.itemLevel}</span>
            {/if}
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

                {#if gear.missingGem}
                    <WowthingImage
                        name="{Constants.icons.gem}"
                        size={20}
                        border={2}
                    />
                {/if}

                {#if gear.missingHeirloom}
                    <WowthingImage
                        name="{Constants.icons.heirloom}"
                        size={20}
                        border={2}
                    />
                {/if}

                {#if gear.missingUpgrade}
                    {@const [iconName, crestCount] = getIconName()}
                    <div
                        class="icon"
                        style:--image-margin-top={iconName ? '0' : '-2px'}
                        class:border-success={iconName && crestCount > 0}
                        class:faded={iconName && crestCount === 0}
                    >
                        {#if iconName}
                            <WowthingImage
                                border={0}
                                name={iconName}
                                size={20}
                            />
                        {:else}
                            <IconifyIcon
                                icon={iconStrings['plus']}
                            />
                        {/if}
                    </div>
                {/if}
            </div>
        {:else if gear.equipped.craftedQuality > 0 || forceCrafted || item?.craftingQuality}
            <div class="crafted-quality">
                <CraftedQualityIcon
                    quality={Math.max(1, gear.equipped.craftedQuality || item?.craftingQuality || 0)}
                />
            </div>
        {/if}
    {/if}
</td>
