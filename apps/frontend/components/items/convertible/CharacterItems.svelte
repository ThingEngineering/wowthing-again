<script lang="ts">
    import some from 'lodash/some'

    import { iconStrings } from '@/data/icons'
    import { AppearanceModifier } from '@/enums/appearance-modifier'
    import { InventoryType } from '@/enums/inventory-type'
    import { ItemLocation } from '@/enums/item-location'
    import { iconLibrary } from '@/shared/icons'
    import { itemStore } from '@/stores'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { ConvertibleCategory } from './types'
    import type { Character, CharacterEquippedItem, CharacterItem } from '@/types'
    import type { ItemDataItem } from '@/types/data/item'

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let character: Character
    export let modifier: AppearanceModifier
    export let season: ConvertibleCategory
    export let setItem: ItemDataItem

    const modifierToTier: Record<AppearanceModifier, number> = {
        [AppearanceModifier.Mythic]: 4,
        [AppearanceModifier.Heroic]: 3,
        [AppearanceModifier.Normal]: 2,
        [AppearanceModifier.LookingForRaid]: 1
    }

    interface ItemWithBonusIds {
        appearanceId?: number
        bonusIds: number[]
        itemId: number
        itemLevel: number
    }

    let usableItems: [
        CharacterEquippedItem | CharacterItem,
        boolean,
        boolean
    ][]
    $: {
        usableItems = []

        const bonusIds = Object.entries($itemStore.itemConversionBonus)
            .filter(([, convertSeason]) => convertSeason === season.id)
            .map(([bonusId,]) => parseInt(bonusId))
        const desiredTier = modifierToTier[modifier]

        const charItems: ItemWithBonusIds[] = [
            ...character.itemsByLocation[ItemLocation.Bags],
            ...Object.values(character.equippedItems)
        ]

        for (const charItem of charItems) {
            if (!(
                charItem.itemId === setItem.id ||
                some(charItem.bonusIds || [], (bonusId) => bonusIds.indexOf(bonusId) >= 0)
            )) {
                continue
            }

            const item = $itemStore.items[charItem.itemId]
            const sighType = item.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : item.inventoryType
            if (sighType !== setItem.inventoryType) {
                // console.log(sighType, setItem.inventoryType)
                continue
            }
            
            let isConvertible = false
            let isUpgradeable = false
            for (const bonusId of charItem.bonusIds) {
                // sharedStringId, current, max
                const upgrade = $itemStore.itemBonusToUpgrade[bonusId]
                if (upgrade) {
                    let currentTier = 0
                    for (let i = 0; i < season.tiers.length; i++) {
                        const tierItemLevel = season.tiers[i]
                        if (charItem.itemLevel >= tierItemLevel) {
                            currentTier = season.tiers.length - i
                            break
                        }
                    }

                    // too low or high for this conversion
                    if (currentTier < (desiredTier - 1) || currentTier > desiredTier) {
                        continue
                    }

                    if (charItem.itemId === setItem.id) {
                        // can be upgraded to the next tier
                        if ((upgrade[2] === 8 && upgrade[1] < 5) ||
                            (upgrade[2] === 5 && upgrade[1] === 1))
                        {
                            isUpgradeable = true
                        }
                    }
                    else {
                        if (currentTier === desiredTier) {
                            isConvertible = true
                        }
                        else if ((upgrade[2] === 8 && upgrade[1] < 5) ||
                            (upgrade[2] === 5 && upgrade[1] < 5))
                        {
                            isConvertible = true
                            isUpgradeable = true
                        }
                    }

                    break
                }
            }

            if (isConvertible || isUpgradeable) {
                usableItems.push([charItem as CharacterItem, isConvertible, isUpgradeable])
            }
        }
    }
</script>

<style lang="scss">
    .wrapper-column {
        gap: 0.5rem;
        padding: 0.4rem 0 0 0;
        width: 100%;
    }
    .upgradeable-item {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    a {
        height: 44px;
        position: relative;
        width: 44px;
    }
    .sadness {
        color: #aaa;
    }
    .item-level {
        background-color: $highlight-background;
        border: 1px solid $border-color;
        border-radius: $border-radius-small;
        bottom: 4px;
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
    .convertible, .upgradeable {
        line-height: 1;
        width: 24px;
    }
    .convertible {
        left: -25px;
    }
    .upgradeable {
        right: -25px;
    }
</style>

<div class="wrapper-column">
    {#each usableItems as [equippedItem, isConvertible, isUpgradeable]}
        <div class="upgradeable-item">
            <span class="upgradeable status-shrug drop-shadow">
                {#if isUpgradeable}
                    <IconifyIcon
                        icon={iconStrings.plus}
                        tooltip={'Upgrade this item!'}
                    />
                {/if}
            </span>

            <a
                class="quality{equippedItem.quality}"
                href={getItemUrl(equippedItem, character)}
            >
                <WowthingImage
                    name="item/{equippedItem.itemId}"
                    size={40}
                    border={2}
                />
                
                <span class="item-level">{equippedItem.itemLevel}</span>
            </a>

            <span class="convertible status-shrug drop-shadow">
                {#if isConvertible}
                    <IconifyIcon
                        icon={iconLibrary.gameShurikenAperture}
                        scale={'0.9'}
                        tooltip={'Convert this item at the Catalyst!'}
                    />
                {/if}
            </span>
        </div>
    {:else}
        <span class="sadness">---</span>
    {/each}
</div>
