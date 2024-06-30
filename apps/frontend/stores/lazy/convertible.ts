import { convertibleCategories, modifierToTier } from '@/components/items/convertible/data';
import { classIdToArmorType, classOrder } from '@/data/character-class';
import { InventoryType } from '@/enums/inventory-type';
import { ItemLocation } from '@/enums/item-location';
import { PlayableClass, playableClasses } from '@/enums/playable-class';
import { QuestStatus } from '@/enums/quest-status';
import {
    UserCount,
    type Character,
    type CharacterEquippedItem,
    type CharacterItem,
    type UserData,
} from '@/types';
import type { UserQuestData } from '@/types/data';
import type { ItemData, ItemDataItem } from '@/types/data/item';
import type { Settings } from '@/shared/stores/settings/types';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

interface LazyStores {
    itemData: ItemData;
    settings: Settings;
    userData: UserData;
    userQuestData: UserQuestData;
}

export class LazyConvertibleCharacterItem {
    public canAfford = true;
    public canConvert = true;
    public canUpgrade = true;
    public isPurchased = false;

    constructor(
        public equippedItem: CharacterEquippedItem | CharacterItem,
        public currentTier: number,
        public currentUpgrade: number,
        public isConvertible: boolean,
        public isUpgradeable: boolean,
    ) {}
}

export class LazyConvertibleModifier {
    public anyCanConvert: boolean;
    public anyCanUpgrade: boolean;
    public anyIsConvertible: boolean;
    public anyIsUpgradeable: boolean;
    public characters: Record<number, LazyConvertibleCharacterItem[]> = {};
    public userHas: boolean;
}

export class LazyConvertibleSlot {
    public modifiers: Record<number, LazyConvertibleModifier> = {};

    constructor(public setItem: ItemDataItem) {}
}

export interface LazyConvertible {
    // { season -> { classId -> { inventoryType -> slotData } } }
    seasons: Record<number, SeasonData>;
    stats: Record<string, UserCount>;
}

type SeasonData = Record<number, Record<number, LazyConvertibleSlot>>;
type WhateverItem = CharacterEquippedItem | CharacterItem;

export function doConvertible(stores: LazyStores): LazyConvertible {
    console.time('doConvertible');

    const maskToClass: Record<number, number> = Object.fromEntries(
        playableClasses.map(([name, mask]) => [
            mask,
            PlayableClass[name as keyof typeof PlayableClass],
        ]),
    );

    const itemCounts: Record<number, number> = {};
    const ret: LazyConvertible = {
        seasons: {},
        stats: {},
    };
    for (const convertibleCategory of convertibleCategories) {
        const seasonData: SeasonData = (ret.seasons[convertibleCategory.id] = {});

        const bonusIds = new Set<number>(
            Object.entries(stores.itemData.itemConversionBonus)
                .filter(([, convertSeason]) => convertSeason === convertibleCategory.id)
                .map(([bonusId]) => parseInt(bonusId)),
        );

        for (const setItemId of stores.itemData.itemConversionEntries[convertibleCategory.id]) {
            const setItem = stores.itemData.items[setItemId];
            const classId = maskToClass[setItem.classMask];
            const setItemInventoryType =
                setItem.inventoryType === InventoryType.Chest2
                    ? InventoryType.Chest
                    : setItem.inventoryType;

            seasonData[classId] ||= {};
            const slotData = (seasonData[classId][setItemInventoryType] = new LazyConvertibleSlot(
                setItem,
            ));

            const validCharacters = stores.userData.characters.filter(
                (char) => char.classId === classId && char.level,
            );

            const charactersWithItems: [Character, WhateverItem[]][] = validCharacters.map(
                (char) => [
                    char,
                    [
                        ...(char.itemsByLocation?.[ItemLocation.Bags] || []),
                        ...Object.values(char.equippedItems),
                    ],
                ],
            );

            for (const modifier of [0, 1, 3, 4]) {
                const modifierData = (slotData.modifiers[modifier] = new LazyConvertibleModifier());

                if (stores.settings.transmog.completionistMode) {
                    modifierData.userHas = stores.userData.hasSource.has(
                        `${setItemId}_${modifier}`,
                    );
                } else {
                    modifierData.userHas = stores.userData.hasAppearance.has(
                        setItem.appearances[modifier]?.appearanceId ?? -1,
                    );
                }

                // if (modifierData.userHas) {
                //     continue;
                // }

                const desiredTier = modifierToTier[modifier];

                for (const [character, charItems] of charactersWithItems) {
                    const characterData: LazyConvertibleCharacterItem[] = [];

                    for (const charItem of charItems) {
                        if (
                            !(
                                charItem.itemId === setItem.id ||
                                (charItem.bonusIds || []).some((bonusId) => bonusIds.has(bonusId))
                            )
                        ) {
                            continue;
                        }

                        const item = stores.itemData.items[charItem.itemId];
                        const charItemInventoryType =
                            item.inventoryType === InventoryType.Chest2
                                ? InventoryType.Chest
                                : item.inventoryType;
                        if (charItemInventoryType !== setItemInventoryType) {
                            continue;
                        }

                        let currentTierLevel = 0;
                        let isConvertible = false;
                        let isUpgradeable = false;
                        let upgrade: [number, number, number];
                        for (const bonusId of charItem.bonusIds) {
                            // sharedStringId, current, max
                            upgrade = stores.itemData.itemBonusToUpgrade[bonusId];
                            if (!upgrade) {
                                continue;
                            }

                            const awfulSeason = convertibleCategory.id === 3 && upgrade[2] === 6;

                            // Forbidden Reach gear is _weird_, 385 gear (2/3) is 5/6 and
                            // 395 gear (3/3) is 6/6?
                            if (awfulSeason) {
                                if (upgrade[1] === 4 || upgrade[1] === 5) {
                                    currentTierLevel = 2;
                                } else if (upgrade[1] === 6) {
                                    currentTierLevel = 3;
                                } else {
                                    currentTierLevel = 1;
                                }
                            } else {
                                for (let i = 0; i < convertibleCategory.tiers.length; i++) {
                                    const tier = convertibleCategory.tiers[i];
                                    if (charItem.itemLevel >= tier.itemLevel) {
                                        currentTierLevel = convertibleCategory.tiers.length - i;
                                        break;
                                    }
                                }
                            }

                            // too low or high for this conversion
                            if (
                                currentTierLevel < desiredTier - 1 ||
                                currentTierLevel > desiredTier
                            ) {
                                continue;
                            }

                            if (charItem.itemId === setItem.id) {
                                // can be upgraded to the next tier
                                if (awfulSeason) {
                                    if (
                                        upgrade[1] < 4 &&
                                        (desiredTier === 2 || desiredTier === 3)
                                    ) {
                                        isUpgradeable = true;
                                    } else if (
                                        upgrade[1] >= 4 &&
                                        upgrade[1] <= 5 &&
                                        desiredTier === 3
                                    ) {
                                        isUpgradeable = true;
                                    }
                                } else {
                                    if (upgrade[2] >= 5 && upgrade[1] <= 4) {
                                        isUpgradeable = true;
                                    }
                                }
                            } else {
                                if (currentTierLevel === desiredTier) {
                                    isConvertible = true;
                                } else if (awfulSeason) {
                                    if (
                                        currentTierLevel === 1 &&
                                        (desiredTier === 2 || desiredTier === 3)
                                    ) {
                                        isConvertible = true;
                                        isUpgradeable = true;
                                    } else if (currentTierLevel === 2 && desiredTier === 3) {
                                        isConvertible = true;
                                        isUpgradeable = true;
                                    } else if (
                                        currentTierLevel > 1 &&
                                        currentTierLevel === desiredTier
                                    ) {
                                        isConvertible = true;
                                    }
                                } else if (upgrade[2] >= 5 && upgrade[1] <= 4) {
                                    isConvertible = true;
                                    isUpgradeable = true;
                                }
                            }

                            break;
                        }

                        if (isConvertible || isUpgradeable) {
                            characterData.push(
                                new LazyConvertibleCharacterItem(
                                    charItem as CharacterItem,
                                    currentTierLevel,
                                    upgrade[1],
                                    isConvertible,
                                    isUpgradeable,
                                ),
                            );
                        }
                    } // for charItem

                    // Creatable from items?
                    if (
                        characterData.length === 0 &&
                        convertibleCategory.sources &&
                        convertibleCategory.sourceTier >= desiredTier - 1 &&
                        convertibleCategory.sourceTier <= desiredTier
                    ) {
                        const charArmorType = classIdToArmorType[character.classId];
                        const sourceItemId =
                            convertibleCategory.sources[charArmorType][setItemInventoryType];
                        const userCount = (itemCounts[sourceItemId] ||= stores.userData.characters
                            .map((char) =>
                                (char.itemsById[sourceItemId] || []).reduce(
                                    (a, b) => a + b.count,
                                    0,
                                ),
                            )
                            .reduce((a, b) => a + b, 0));
                        if (userCount > 0) {
                            characterData.push(
                                new LazyConvertibleCharacterItem(
                                    {
                                        itemId: sourceItemId,
                                        itemLevel: userCount,
                                        quality: 1,
                                    } as CharacterItem,
                                    convertibleCategory.sourceTier,
                                    0,
                                    true,
                                    convertibleCategory.sourceTier < desiredTier,
                                ),
                            );
                        }
                    }

                    // Purchaseable?
                    if (characterData.length === 0 && convertibleCategory.purchases) {
                        const usefulPurchases = convertibleCategory.purchases.filter((purchase) =>
                            purchase.upgradeable === false
                                ? purchase.upgradeTier === desiredTier
                                : purchase.upgradeTier >= desiredTier - 1 &&
                                  purchase.upgradeTier <= desiredTier,
                        );

                        for (const purchase of usefulPurchases) {
                            if (
                                purchase.progressKey &&
                                stores.userQuestData.characters[character.id]?.progressQuests?.[
                                    purchase.progressKey
                                ]?.status === QuestStatus.Completed
                            ) {
                                continue;
                            }

                            const costAmount =
                                typeof purchase.costAmount === 'object'
                                    ? purchase.costAmount[setItemInventoryType]
                                    : purchase.costAmount;

                            const purchaseable = new LazyConvertibleCharacterItem(
                                {
                                    itemId: purchase.costId,
                                    itemLevel: costAmount,
                                    quality: 1,
                                } as CharacterItem,
                                purchase.upgradeTier,
                                0,
                                true,
                                purchase.upgradeable !== false &&
                                    purchase.upgradeTier < desiredTier,
                            );

                            purchaseable.isPurchased = true;
                            purchaseable.canAfford =
                                (purchase.costId > 10_000
                                    ? character.getItemCount(purchase.costId)
                                    : character.currencies?.[purchase.costId]?.quantity || 0) >=
                                costAmount;

                            characterData.push(purchaseable);
                        }
                    } // if purchases

                    if (characterData.length > 0) {
                        for (const sigh of characterData) {
                            if (convertibleCategory.conversionCurrencyId) {
                                sigh.canConvert =
                                    (character.currencies?.[
                                        convertibleCategory.conversionCurrencyId
                                    ]?.quantity || 0) > 0;
                            }

                            if (sigh.isUpgradeable) {
                                const tier =
                                    convertibleCategory.tiers[
                                        convertibleCategory.tiers.length - desiredTier
                                    ];
                                // DF Season 1 + Forbidden Reach = ARGH
                                if (
                                    convertibleCategory.id === 3 &&
                                    ((sigh.equippedItem.itemLevel === 385 &&
                                        (sigh.currentUpgrade === 4 || sigh.currentUpgrade === 5)) ||
                                        sigh.equippedItem.itemLevel < 100)
                                ) {
                                    sigh.canUpgrade = character.getItemCount(204276) > 0;
                                } else if (tier.lowUpgrade) {
                                    if (sigh.currentUpgrade < 4) {
                                        let charHas = 0;
                                        for (const [upgradeId, upgradeCount] of tier.lowUpgrade) {
                                            const charCount =
                                                upgradeId > 10_000
                                                    ? character.getItemCount(upgradeId)
                                                    : character.currencies?.[upgradeId]?.quantity ||
                                                      0;
                                            charHas += Math.floor(charCount / upgradeCount);
                                        }

                                        sigh.canUpgrade = charHas >= 4 - sigh.currentUpgrade;
                                    }

                                    if (sigh.canUpgrade && tier.highUpgrade) {
                                        let charHas = 0;
                                        for (const [upgradeId, upgradeCount] of tier.highUpgrade) {
                                            const charCount =
                                                upgradeId > 10_000
                                                    ? character.getItemCount(upgradeId)
                                                    : character.currencies?.[upgradeId]?.quantity ||
                                                      0;
                                            charHas += Math.floor(charCount / upgradeCount);
                                        }

                                        sigh.canUpgrade = charHas >= 1;
                                    }
                                }
                            }
                        }

                        characterData.sort((a, b) => {
                            if (a.equippedItem.itemLevel !== b.equippedItem.itemLevel) {
                                return b.equippedItem.itemLevel - a.equippedItem.itemLevel;
                            }
                            if (a.isUpgradeable !== b.isUpgradeable) {
                                return (a.isUpgradeable ? 1 : 0) - (b.isUpgradeable ? 1 : 0);
                            }
                            if (a.isConvertible !== b.isConvertible) {
                                return (a.isConvertible ? 1 : 0) - (b.isConvertible ? 1 : 0);
                            }
                            return 0;
                        });

                        modifierData.characters[character.id] = characterData;
                    }
                } // for character

                modifierData.anyCanConvert = Object.values(modifierData.characters).some(
                    (entries) => entries.some((entry) => entry.canConvert),
                );
                modifierData.anyIsConvertible = Object.values(modifierData.characters).some(
                    (entries) => entries.some((entry) => entry.isConvertible),
                );
                modifierData.anyCanUpgrade = Object.values(modifierData.characters).some(
                    (entries) => entries.some((entry) => entry.canUpgrade),
                );
                modifierData.anyIsUpgradeable = Object.values(modifierData.characters).some(
                    (entries) => entries.some((entry) => entry.isUpgradeable),
                );
            } // for modifier
        } // for setItemId

        const seasonStats = (ret.stats[convertibleCategory.id] = new UserCount());
        const modifierStats: Record<number, UserCount> = {};
        const classModifierStats: Record<string, UserCount> = {};
        const classStats: Record<number, UserCount> = {};
        for (const modifier of [0, 1, 3, 4]) {
            modifierStats[modifier] = ret.stats[`${convertibleCategory.id}--m${modifier}`] =
                new UserCount();
            for (const classId of classOrder) {
                classModifierStats[`c${classId}--m${modifier}`] = ret.stats[
                    `${convertibleCategory.id}--c${classId}--m${modifier}`
                ] = new UserCount();
            }
        }
        for (const classId of classOrder) {
            classStats[classId] = ret.stats[`${convertibleCategory.id}--c${classId}`] =
                new UserCount();
        }

        for (const [classId, classData] of getNumberKeyedEntries(seasonData)) {
            for (const slotData of Object.values(classData)) {
                for (const [modifier, modifierData] of getNumberKeyedEntries(slotData.modifiers)) {
                    const classModifierKey = `c${classId}--m${modifier}`;

                    seasonStats.total++;
                    classStats[classId].total++;
                    classModifierStats[classModifierKey].total++;
                    modifierStats[modifier].total++;

                    if (modifierData.userHas) {
                        seasonStats.have++;
                        classStats[classId].have++;
                        classModifierStats[classModifierKey].have++;
                        modifierStats[modifier].have++;
                    }
                }
            }
        }
    } // for convertibleCategory

    console.timeEnd('doConvertible');

    return ret;
}
