import groupBy from 'lodash/groupBy';

import { convertibleCategories, modifierToTier } from '@/components/items/convertible/data';
import { classIdToArmorType, classOrder } from '@/data/character-class';
import { ItemLocation } from '@/enums/item-location';
import { inventoryTypeToItemRedundancySlot } from '@/enums/item-redundancy-slot';
import { PlayableClass, playableClasses } from '@/enums/playable-class';
import { QuestStatus } from '@/enums/quest-status';
import { browserState } from '@/shared/state/browser.svelte';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { UserCount, type Character, type CharacterEquippedItem, type CharacterItem } from '@/types';
import { fixedInventoryType } from '@/utils/fixed-inventory-type';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import type { ItemDataItem } from '@/types/data/item';
import type { WarbankItem } from '@/types/items';
import { userState } from '../user';

export class LazyConvertibleCharacterItem {
    public canAfford = true;
    public canConvert = true;
    public canUpgrade = true;
    public isPurchased = false;

    constructor(
        public equippedItem: CharacterEquippedItem | CharacterItem | WarbankItem,
        public currentTier: number,
        public currentUpgrade: number,
        public isConvertible: boolean,
        public isUpgradeable: boolean
    ) {}
}

export class LazyConvertibleModifier {
    public anyCanAfford: boolean;
    public anyCanConvert: boolean;
    public anyCanUpgrade: boolean;
    public anyIsConvertible: boolean;
    public anyIsPurchaseable: boolean;
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
type WhateverItem = CharacterEquippedItem | CharacterItem | WarbankItem;

export function doConvertible(): LazyConvertible {
    console.time('LazyState.doConvertible');

    const completionistMode = settingsState.value.transmog.completionistMode;
    const includePurchases = browserState.current.convertible.includePurchases;
    const hasAppearanceById = $state.snapshot(userState.general.hasAppearanceById);
    const hasAppearanceBySource = $state.snapshot(userState.general.hasAppearanceBySource);

    const maskToClass: Record<number, number> = Object.fromEntries(
        playableClasses.map(([name, mask]) => [
            mask,
            PlayableClass[name as keyof typeof PlayableClass],
        ])
    );

    const warbankItems: [WarbankItem, ItemDataItem][] = (userState.general.warbankItems || []).map(
        (warbankItem) => [warbankItem, wowthingData.items.items[warbankItem.itemId]]
    );
    const warbankByType = groupBy(
        warbankItems.filter(([, item]) => item?.inventoryType > 0),
        ([, item]) => fixedInventoryType(item.inventoryType)
    );

    const itemConversionBonusEntries = getNumberKeyedEntries(
        wowthingData.items.itemConversionBonus
    );

    const minimumLevel = convertibleCategories.at(-1).minimumLevel;
    const charactersByClassId: Record<number, [Character, WhateverItem[][]][]> = groupBy(
        userState.general.activeCharacters
            .filter((char) => char.level >= minimumLevel)
            .map((char) => [
                char,
                [
                    char.itemsByLocation[ItemLocation.Bags],
                    char.itemsByLocation[ItemLocation.Bank],
                    Object.values(char.equippedItems),
                ],
            ]),
        ([char]) => char.classId
    );

    const itemCounts: Record<number, number> = {};
    const ret: LazyConvertible = {
        seasons: {},
        stats: {},
    };
    for (const convertibleCategory of convertibleCategories) {
        const seasonData: SeasonData = (ret.seasons[convertibleCategory.id] = {});

        const bonusIds = new Set<number>(
            itemConversionBonusEntries
                .filter(([, convertSeason]) => convertSeason === convertibleCategory.id)
                .map(([bonusId]) => bonusId)
        );

        const hasUpgrades = convertibleCategory.tiers.some(
            (tier) => tier.lowUpgrade || tier.highUpgrade
        );

        for (const setItemId of wowthingData.items.itemConversionEntries[convertibleCategory.id] ||
            []) {
            const setItem = wowthingData.items.items[setItemId];
            const classId = maskToClass[setItem.classMask];
            if (!classId) {
                console.warn('invalid classMask', setItem.classMask);
                continue;
            }

            const setItemInventoryType = fixedInventoryType(setItem.inventoryType);
            const setItemRedundancySlot = inventoryTypeToItemRedundancySlot[setItemInventoryType];

            seasonData[classId] ||= {};
            const slotData = (seasonData[classId][setItemInventoryType] = new LazyConvertibleSlot(
                setItem
            ));

            const charactersWithItems: [Character, WhateverItem[]][] = (
                charactersByClassId[classId] || []
            )
                .filter(([char]) => char.level >= convertibleCategory.minimumLevel)
                .map(([char, charItems]) => [
                    char,
                    [
                        ...charItems,
                        (warbankByType[setItemInventoryType] || []).map(([wbi]) => wbi),
                    ].flatMap((array) =>
                        array.filter(
                            (item) =>
                                ((wowthingData.items.items[item.itemId]?.classMask || 0) &
                                    setItem.classMask) ===
                                    setItem.classMask &&
                                (item.itemId === setItemId ||
                                    (item.bonusIds || []).some((bonusId) => bonusIds.has(bonusId)))
                        )
                    ),
                ]);

            for (const modifier of [0, 1, 3, 4]) {
                const modifierData = (slotData.modifiers[modifier] = new LazyConvertibleModifier());

                if (completionistMode) {
                    modifierData.userHas = hasAppearanceBySource.has(setItemId * 1000 + modifier);
                } else {
                    modifierData.userHas = hasAppearanceById.has(
                        setItem.appearances[modifier]?.appearanceId ?? -1
                    );
                }

                // if (modifierData.userHas) {
                //     continue;
                // }

                const desiredTier = modifierToTier[modifier];

                for (const [character, charItems] of charactersWithItems) {
                    const characterData: LazyConvertibleCharacterItem[] = [];
                    const maxItemLevel = character.highestItemLevel?.[setItemRedundancySlot] || 0;

                    for (const charItem of charItems) {
                        const item = wowthingData.items.items[charItem.itemId];
                        const charItemInventoryType = fixedInventoryType(item.inventoryType);
                        if (charItemInventoryType !== setItemInventoryType) {
                            continue;
                        }

                        let currentTierLevel = 0;
                        let isConvertible = false;
                        let isUpgradeable = false;
                        // sharedStringId, current, max
                        let upgrade: [number, number, number];
                        for (const bonusId of charItem.bonusIds) {
                            upgrade = wowthingData.items.itemBonusToUpgrade[bonusId];
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
                                currentTierLevel > desiredTier ||
                                (!hasUpgrades && currentTierLevel < desiredTier)
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
                                } else if (hasUpgrades) {
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
                                    isUpgradeable = hasUpgrades;
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
                                    isUpgradeable
                                )
                            );
                        }
                    } // for charItem

                    // Creatable from items?
                    if (
                        characterData.length === 0 &&
                        convertibleCategory.sources &&
                        convertibleCategory.sourceTier >= desiredTier - 1 &&
                        convertibleCategory.sourceTier <= desiredTier &&
                        (hasUpgrades || convertibleCategory.sourceTier === desiredTier)
                    ) {
                        const charArmorType = classIdToArmorType[character.classId];
                        const sourceItemId =
                            convertibleCategory.sources[charArmorType][setItemInventoryType];
                        const userCount = (itemCounts[sourceItemId] ||= userState.general.characters
                            .map((char) => char.getItemCount(sourceItemId))
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
                                    hasUpgrades && convertibleCategory.sourceTier < desiredTier
                                )
                            );
                        }
                    }

                    // Purchaseable?
                    if (
                        includePurchases &&
                        characterData.length === 0 &&
                        convertibleCategory.purchases
                    ) {
                        const usefulPurchases = convertibleCategory.purchases.filter(
                            (purchase) =>
                                purchase.costAmount[setItemInventoryType] &&
                                (!hasUpgrades || purchase.upgradeable === false
                                    ? purchase.upgradeTier === desiredTier
                                    : purchase.upgradeTier >= desiredTier - 1 &&
                                      purchase.upgradeTier <= desiredTier)
                        );

                        for (const purchase of usefulPurchases) {
                            if (
                                purchase.progressKey &&
                                userState.quests.characterById
                                    .get(character.id)
                                    ?.progressQuestByKey?.get(purchase.progressKey)?.status ===
                                    QuestStatus.Completed
                            ) {
                                continue;
                            }

                            const costAmount = purchase.costAmount[setItemInventoryType];

                            const purchaseable = new LazyConvertibleCharacterItem(
                                {
                                    itemId: purchase.costId,
                                    itemLevel: costAmount,
                                    quality: 1,
                                } as CharacterItem,
                                purchase.upgradeTier,
                                0,
                                true,
                                hasUpgrades &&
                                    purchase.upgradeable !== false &&
                                    purchase.upgradeTier < desiredTier
                            );

                            purchaseable.isPurchased = true;
                            purchaseable.canAfford =
                                (purchase.costId > 10_000
                                    ? character.getItemCount(purchase.costId)
                                    : character.currencies?.[purchase.costId]?.quantity || 0) >=
                                costAmount;
                            purchaseable.canUpgrade = hasUpgrades;

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
                                const tierIndex = convertibleCategory.tiers.length - desiredTier;
                                const tier = convertibleCategory.tiers[tierIndex];
                                // const nextTier = convertibleCategory.tiers[tierIndex + 1];

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
                                        for (const {
                                            upgradeId,
                                            upgradeCost,
                                            achievementId,
                                            achievementUpgradeCost,
                                        } of tier.lowUpgrade) {
                                            const actualCost =
                                                achievementId &&
                                                userState.achievements.achievementEarnedById.has(
                                                    achievementId
                                                )
                                                    ? achievementUpgradeCost || upgradeCost
                                                    : upgradeCost;

                                            const charCount =
                                                upgradeId > 10_000
                                                    ? character.getItemCount(upgradeId)
                                                    : character.currencies?.[upgradeId]?.quantity ||
                                                      0;

                                            charHas += Math.floor(charCount / actualCost);
                                        }

                                        // upgrades to the current highest item level cost no crests
                                        for (
                                            let upgradeLevel = sigh.currentUpgrade + 1;
                                            upgradeLevel <= 4;
                                            upgradeLevel++
                                        ) {
                                            const upgradedItemLevel =
                                                sigh.equippedItem.itemLevel +
                                                3 * (upgradeLevel - sigh.currentUpgrade);
                                            if (upgradedItemLevel <= maxItemLevel) {
                                                charHas++;
                                            }
                                        }

                                        sigh.canUpgrade = charHas >= 4 - sigh.currentUpgrade;
                                    }

                                    if (sigh.canUpgrade && tier.highUpgrade) {
                                        let charHas = 0;
                                        for (const {
                                            upgradeId,
                                            upgradeCost,
                                            achievementId,
                                            achievementUpgradeCost,
                                        } of tier.highUpgrade) {
                                            const actualCost =
                                                achievementId &&
                                                userState.achievements.achievementEarnedById.has(
                                                    achievementId
                                                )
                                                    ? achievementUpgradeCost || upgradeCost
                                                    : upgradeCost;

                                            const charCount =
                                                upgradeId > 10_000
                                                    ? character.getItemCount(upgradeId)
                                                    : character.currencies?.[upgradeId]?.quantity ||
                                                      0;

                                            charHas += Math.floor(charCount / actualCost);
                                        }

                                        sigh.canUpgrade = charHas >= 1;
                                    }
                                }
                            }
                        }

                        characterData.sort((a, b) => {
                            if (a.isPurchased !== b.isPurchased) {
                                return (a.isPurchased ? 1 : 0) - (b.isPurchased ? 1 : 0);
                            }
                            if (
                                !a.isPurchased &&
                                !b.isPurchased &&
                                a.equippedItem.itemLevel !== b.equippedItem.itemLevel
                            ) {
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

                for (const entries of Object.values(modifierData.characters)) {
                    for (const entry of entries) {
                        modifierData.anyCanAfford ||= entry.canAfford;
                        modifierData.anyCanConvert ||= entry.canConvert;
                        modifierData.anyCanUpgrade ||= entry.canUpgrade;
                        modifierData.anyIsConvertible ||= entry.isConvertible;
                        modifierData.anyIsPurchaseable ||= entry.isPurchased;
                        modifierData.anyIsUpgradeable ||= entry.isUpgradeable;
                    }
                }
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

    console.timeEnd('LazyState.doConvertible');

    return ret;
}
