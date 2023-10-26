import some from 'lodash/some'

import { convertibleCategories } from '@/components/items/convertible/data'
import { AppearanceModifier } from '@/enums/appearance-modifier'
import { InventoryType } from '@/enums/inventory-type'
import { ItemLocation } from '@/enums/item-location'
import { PlayableClass, playableClasses } from '@/enums/playable-class'
import type { CharacterEquippedItem, CharacterItem, Settings, UserData } from '@/types'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { ItemData, ItemDataItem } from '@/types/data/item'
import { RewardType } from '@/enums/reward-type'
import { QuestStatus } from '@/enums/quest-status'


interface LazyStores {
    itemData: ItemData,
    settings: Settings,
    userData: UserData,
    userQuestData: UserQuestData,
    userTransmogData: UserTransmogData,
}

export class LazyConvertibleCharacterItem {
    public isPurchaseable: boolean

    constructor(
        public equippedItem: CharacterEquippedItem | CharacterItem,
        public isConvertible: boolean,
        public isUpgradeable: boolean
    ) { }
}

export class LazyConvertibleModifier {
    public characters: Record<number, LazyConvertibleCharacterItem[]> = {}
    public userHas: boolean
}

export class LazyConvertibleSlot {
    public modifiers: Record<number, LazyConvertibleModifier> = {}
    public userHas: boolean

    constructor(
        public setItem: ItemDataItem
    ) { }
}

export interface LazyConvertible {
    // { season -> { classId -> { inventoryType -> slotData } } }
    seasons: Record<number, Record<number, Record<number, LazyConvertibleSlot>>>
}


const modifierToTier: Record<number, number> = {
    [AppearanceModifier.Mythic]: 4,
    [AppearanceModifier.Heroic]: 3,
    [AppearanceModifier.Normal]: 2,
    [AppearanceModifier.LookingForRaid]: 1
}

type WhateverItem = CharacterEquippedItem | CharacterItem

export function doConvertible(
    stores: LazyStores,
): LazyConvertible {
    console.time('doConvertible')

    const maskToClass: Record<number, number> = Object.fromEntries(
        playableClasses.map(([name, mask]) => [
            mask,
            PlayableClass[name as keyof typeof PlayableClass]
        ])
    )
    
    const ret: LazyConvertible = { seasons: {} }
    for (const convertibleCategory of convertibleCategories) {
        const seasonData: Record<number, Record<number, LazyConvertibleSlot>> = ret.seasons[convertibleCategory.id] = {}
        
        for (const setItemId of stores.itemData.itemConversionEntries[convertibleCategory.id]) {
            const setItem = stores.itemData.items[setItemId]
            const classId = maskToClass[setItem.classMask]
            const inventoryType = setItem.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : setItem.inventoryType
            
            seasonData[classId] ||= {}
            const slotData = seasonData[classId][inventoryType] = new LazyConvertibleSlot(setItem)
    
            const validCharacters = stores.userData.characters
                .filter((char) => char.classId === classId && char.level)

            const bonusIds = new Set<number>(
                Object.entries(stores.itemData.itemConversionBonus)
                    .filter(([, convertSeason]) => convertSeason === convertibleCategory.id)
                    .map(([bonusId,]) => parseInt(bonusId))
            )

            for (const modifier of [0, 1, 3, 4]) {
                const modifierData = slotData.modifiers[modifier] = new LazyConvertibleModifier()
                
                if (stores.settings.transmog.completionistMode) {
                    modifierData.userHas = stores.userTransmogData.hasSource.has(`${setItemId}_${modifier}`)
                }
                else {
                    modifierData.userHas = stores.userTransmogData.hasAppearance.has(setItem.appearances[modifier]?.appearanceId ?? -1)
                }

                if (modifierData.userHas) {
                    continue
                }
    
                const desiredTier = modifierToTier[modifier]
        
                for (const character of validCharacters) {
                    const characterData: LazyConvertibleCharacterItem[] = []

                    const charItems: WhateverItem[] = [
                        ...character.itemsByLocation?.[ItemLocation.Bags] || [],
                        ...Object.values(character.equippedItems)
                    ]

                    for (const charItem of charItems) {
                        if (!(
                            charItem.itemId === setItem.id ||
                            some(charItem.bonusIds || [], (bonusId) => bonusIds.has(bonusId))
                        )) {
                            continue
                        }
    
                        const item = stores.itemData.items[charItem.itemId]
                        const sighType = item.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : item.inventoryType
                        if (sighType !== setItem.inventoryType) {
                            continue
                        }
                
                        let isConvertible = false
                        let isUpgradeable = false
                        for (const bonusId of charItem.bonusIds) {
                            // sharedStringId, current, max
                            const upgrade = stores.itemData.itemBonusToUpgrade[bonusId]
                            if (upgrade) {
                                const awfulSeason = convertibleCategory.id === 3 && upgrade[2] === 6
                                let currentTier = 0

                                if (awfulSeason) {
                                    if (upgrade[1] === 5) {
                                        currentTier = 2
                                    }
                                    else if (upgrade[1] === 6) {
                                        currentTier = 3
                                    }
                                    else {
                                        currentTier = 1
                                    }
                                }
                                else {
                                    for (let i = 0; i < convertibleCategory.tiers.length; i++) {
                                        const tierItemLevel = convertibleCategory.tiers[i]
                                        if (charItem.itemLevel >= tierItemLevel) {
                                            currentTier = convertibleCategory.tiers.length - i
                                            break
                                        }
                                    }
                                }
    
                                // too low or high for this conversion
                                if (currentTier < (desiredTier - 1) || currentTier > desiredTier) {
                                    continue
                                }
    
                                if (charItem.itemId === setItem.id) {
                                    // can be upgraded to the next tier
                                    if (awfulSeason) {
                                        if (upgrade[1] === 1 && (desiredTier === 2 || desiredTier === 3)) {
                                            isUpgradeable = true
                                        }
                                        else if (upgrade[1] === 2 && desiredTier === 3) {
                                            isUpgradeable = true
                                        }
                                    }
                                    else {
                                        if ((upgrade[2] === 8 && upgrade[1] < 5) ||
                                            (upgrade[2] === 5 && upgrade[1] === 1)) {
                                            isUpgradeable = true
                                        }
                                    }
                                }
                                else {
                                    if (currentTier === desiredTier) {
                                        isConvertible = true
                                    }
                                    else if (awfulSeason) {
                                        if (currentTier === 1 && (desiredTier === 2 || desiredTier === 3)) {
                                            isConvertible = true
                                            isUpgradeable = true
                                        }
                                        else if (currentTier === 2 && desiredTier === 3) {
                                            isConvertible = true
                                            isUpgradeable = true
                                        }
                                        else if (currentTier > 1 && currentTier === desiredTier) {
                                            isConvertible = true
                                        }
                                    }
                                    else if ((upgrade[2] === 8 && upgrade[1] < 5) ||
                                        (upgrade[2] === 5 && upgrade[1] < 5)) {
                                        isConvertible = true
                                        isUpgradeable = true
                                    }
                                }
    
                                break
                            }
                        }
    
                        if (isConvertible || isUpgradeable) {
                            characterData.push(new LazyConvertibleCharacterItem(
                                charItem as CharacterItem,
                                isConvertible,
                                isUpgradeable
                            ))
                        }
                    } // for charItem

                    if (characterData.length === 0 && convertibleCategory.purchases) {
                        const usefulPurchases = convertibleCategory.purchases
                            .filter((p) => p[3] >= (desiredTier - 1) && p[3] <= desiredTier)

                        for (const [currencyType, currencyId, currencyCost, upgradeTier, progressKey] of usefulPurchases) {
                            if ((
                                currencyType === RewardType.Item && (
                                    character.getItemCount(currencyId) < currencyCost &&
                                    (
                                        !progressKey ||
                                        stores.userQuestData.characters[character.id]?.progressQuests?.[progressKey]?.status === QuestStatus.Completed
                                    )
                                )
                            )) {
                                continue
                            }

                            characterData.push(new LazyConvertibleCharacterItem(
                                {
                                    itemId: currencyId,
                                    itemLevel: currencyCost,
                                    quality: 1,
                                } as CharacterItem,
                                true,
                                upgradeTier < desiredTier
                            ))
                        }
                    }

                    if (characterData.length > 0) {
                        modifierData.characters[character.id] = characterData
                    }
                } // for character
            } // for modifier
        } // for setItemId
    } // for convertibleCategory

    console.timeEnd('doConvertible')

    return ret
}
