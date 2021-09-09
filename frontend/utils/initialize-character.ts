import Base64ArrayBuffer from 'base64-arraybuffer'
import keys from 'lodash/keys'

import getItemLevelQuality from './get-item-level-quality'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import type { Character, CharacterMythicPlusRun } from '@/types'
import { InventorySlot } from '@/types/enums'
import {CharacterMythicPlusRunMember} from '@/types'

export default function initializeCharacter(character: Character): void {
    // item levels
    if (keys(character.equippedItems).length > 0) {
        let count = 0,
            itemLevels = 0
        for (let j = 0; j < slotOrder.length; j++) {
            const slot = slotOrder[j]
            const item = character.equippedItems[slot]
            if (item !== undefined) {
                itemLevels += item.itemLevel
                count++
                if (
                    slot === InventorySlot.MainHand &&
                    character.equippedItems[InventorySlot.OffHand] === undefined
                ) {
                    itemLevels += item.itemLevel
                    count++
                }
            }
        }

        const itemLevel = itemLevels / count
        if (itemLevel - character.equippedItemLevel < 1) {
            character.calculatedItemLevel = itemLevel.toFixed(1)
        }
    }

    if (character.calculatedItemLevel === undefined) {
        character.calculatedItemLevel = character.equippedItemLevel.toFixed(1)
    }

    character.calculatedItemLevelQuality = getItemLevelQuality(
        parseFloat(character.calculatedItemLevel),
    )

    // mythic+ seasons
    if (character.mythicPlus?.seasons) {
        character.mythicPlus.seasonBadges = {}
        for (const seasonId in seasonMap) {
            const season = seasonMap[seasonId]
            if (character.level >= season.MinLevel) {
                const characterSeason = character.mythicPlus.seasons[seasonId]
                if (characterSeason !== undefined) {
                    let total = 0,
                        timed2 = 0,
                        timed5 = 0,
                        timed10 = 0,
                        timed15 = 0
                    for (let i = 0; i < season.Orders.length; i++) {
                        for (let j = 0; j < season.Orders[i].length; j++) {
                            total++
                            const dungeonId = season.Orders[i][j]
                            const runs = characterSeason[dungeonId] || []
                            for (let runIndex = 0; runIndex < runs.length; runIndex++) {
                                const run = runs[runIndex] as CharacterMythicPlusRun

                                // Members are packed arrays, convert them to useful objects
                                run.memberObjects = run.members.map(m => new CharacterMythicPlusRunMember(...m))

                                if (run.timed) {
                                    if (run.keystoneLevel >= 15) {
                                        timed15++
                                    }
                                    if (run.keystoneLevel >= 10) {
                                        timed10++
                                    }
                                    if (run.keystoneLevel >= 5) {
                                        timed5++
                                    }
                                    timed2++
                                    break
                                }
                            }
                        }
                    }

                    if (timed15 === total) {
                        character.mythicPlus.seasonBadges[season.Id] = '15'
                    } else if (timed10 === total) {
                        character.mythicPlus.seasonBadges[season.Id] = '10'
                    } else if (timed5 === total) {
                        character.mythicPlus.seasonBadges[season.Id] = '5'
                    } else if (timed2 === total) {
                        character.mythicPlus.seasonBadges[season.Id] = '2'
                    }
                }
            }
        }
    }
}
