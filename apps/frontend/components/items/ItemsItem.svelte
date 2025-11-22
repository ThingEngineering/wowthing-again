<script lang="ts">
    import {
        currentUpgrade1,
        currentUpgrade2,
        currentUpgrade3,
        currentUpgrade4,
    } from './convertible/data';
    import { Constants } from '@/data/constants';
    import { iconStrings } from '@/data/icons';
    import { wowthingData } from '@/shared/stores/data';
    import { getItemUrl } from '@/utils/get-item-url';
    import type { Character, CharacterGear } from '@/types';

    import CraftedQualityIcon from '@/shared/components/images/CraftedQualityIcon.svelte';
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';
    import type { ConvertibleCategoryUpgrade } from './convertible/types';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';

    export let character: Character = undefined;
    export let forceCrafted = false;
    export let gear: Partial<CharacterGear>;
    export let tierPieces: number[] = undefined;
    export let useHighlighting = false;
    export let useItemCount = false;

    function getIconName(): [string, number] {
        let tiers: ConvertibleCategoryUpgrade[][];
        for (const bonusId of gear.equipped.bonusIds) {
            if (!wowthingData.items.itemBonusCurrentSeason.has(bonusId)) {
                continue;
            }

            const upgrade = wowthingData.items.itemBonusToUpgrade[bonusId];
            if (upgrade?.[0] > 0 && upgrade[1] < upgrade[2]) {
                if (upgrade[0] === Constants.upgradeTiers.explorer) {
                    tiers = [null, null];
                } else if (upgrade[0] === Constants.upgradeTiers.adventurer) {
                    tiers = [null, currentUpgrade1];
                } else if (upgrade[0] === Constants.upgradeTiers.veteran) {
                    tiers = [currentUpgrade1, currentUpgrade2];
                } else if (upgrade[0] === Constants.upgradeTiers.champion) {
                    tiers = [currentUpgrade2, currentUpgrade3];
                } else if (upgrade[0] === Constants.upgradeTiers.hero) {
                    tiers = [currentUpgrade3, currentUpgrade4];
                } else if (upgrade[0] === Constants.upgradeTiers.myth) {
                    tiers = [currentUpgrade4, null];
                } else {
                    console.log(upgrade);
                }

                if (upgrade[1] < 4 && tiers[0]) {
                    return getCurrencyData(tiers[0][0]);
                } else if (upgrade[1] >= 4 && tiers[1] && (tiers.length === 2 || upgrade[1] < 8)) {
                    return getCurrencyData(tiers[1][0]);
                } else if (upgrade[1] >= 8 && tiers[2]) {
                    return getCurrencyData(tiers[2][0]);
                }

                return ['currency/3008', 0];
            }
        }

        return [null, 0];
    }

    function getCurrencyData(tier: ConvertibleCategoryUpgrade): [string, number] {
        return [
            `currency/${tier.upgradeId}`,
            Math.floor((character.currencies?.[tier.upgradeId]?.quantity || 0) / tier.upgradeCost),
        ];
    }

    const getUpgradeData = () => {
        for (const bonusId of gear.equipped.bonusIds) {
            if (wowthingData.items.itemBonusCurrentSeason.has(bonusId)) {
                const upgrades = wowthingData.items.itemBonusToUpgrade[bonusId];
                if (upgrades) {
                    return upgrades;
                }
            }
        }
    };
</script>

<style lang="scss">
    .gear {
        height: 46px;
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
        background-color: var(--color-highlight-background);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-small);
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
            color: var(--color-body-text);
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
            opacity: var(--opacity-faded);
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

        background: var(--color-thing-background);
        border: 2px solid var(--image-border-color);
        border-radius: var(--border-radius);
        color: var(--color-success);
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
    .upgrade-level {
        font-size: 90%;
        word-spacing: -0.2ch;
    }
</style>

<td class="gear" class:no-problem={useHighlighting && !gear.highlight}>
    {#if gear.equipped !== undefined}
        {#if gear.equipped.itemId === Constants.items.petCage}
            {@const pet = wowthingData.static.petById.get(gear.equipped.context)}
            <!-- this component does way too much-->
            <WowheadLink id={pet.creatureId} type="npc" extraClass="quality{gear.equipped.quality}">
                <WowthingImage name="spell/{pet.spellId}" size={40} border={2} />
                <span class="item-level">{gear.equipped.itemLevel}</span>
            </WowheadLink>
        {:else}
            {@const item = wowthingData.items.items[gear.equipped.itemId]}
            <a
                class="quality{gear.equipped.quality}"
                href={getItemUrl(gear.equipped, character, tierPieces)}
            >
                <WowthingImage name="item/{gear.equipped.itemId}" size={40} border={2} />

                {#if useItemCount}
                    {#if item?.equippable}
                        <span class="item-level right">{gear.equipped.itemLevel}</span>
                    {:else if (gear.equipped.count || 0) > 1}
                        <span class="item-level left">x{gear.equipped.count}</span>
                    {/if}
                {:else}
                    <span class="item-level">{gear.equipped.itemLevel}</span>
                {/if}
            </a>

            {#if gear.highlight}
                <div class="problems">
                    {#if gear.missingEnchant}
                        <WowthingImage name={Constants.icons.enchant} size={20} border={2} />
                    {/if}

                    {#if gear.missingGem}
                        <WowthingImage name={Constants.icons.gem} size={20} border={2} />
                    {/if}

                    {#if gear.missingHeirloom}
                        <WowthingImage name={Constants.icons.heirloom} size={20} border={2} />
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
                                <WowthingImage border={0} name={iconName} size={20} />
                            {:else}
                                <IconifyIcon icon={iconStrings['plus']} />
                            {/if}
                        </div>
                    {/if}
                </div>
            {:else if gear.equipped.craftedQuality > 0 || forceCrafted || item?.craftingQuality}
                <div class="crafted-quality">
                    <CraftedQualityIcon
                        quality={Math.max(
                            1,
                            gear.equipped.craftedQuality || item?.craftingQuality || 0
                        )}
                    />
                </div>
            {:else}
                {@const upgradeData = getUpgradeData()}
                {#if upgradeData?.[0] > 0}
                    {@const upgradeString = wowthingData.static.sharedStringById.get(
                        upgradeData[0]
                    )}
                    {@const percent = (upgradeData[1] / upgradeData[2]) * 100}
                    <span
                        class="upgrade-level pill abs-center"
                        class:status-fail={percent === 0}
                        class:status-shrug={percent > 0 && percent < 100}
                        class:status-success={percent === 100}
                    >
                        {upgradeString.charAt(0)}
                        {upgradeData[1]}/{upgradeData[2]}
                    </span>
                {/if}
            {/if}
        {/if}
    {/if}
</td>
