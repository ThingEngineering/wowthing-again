import keys from 'lodash/keys'

import {seasonMap} from '../data/dungeon'
import {InventorySlot, slotOrder} from '../data/inventory-slot'
import type {Character, CharacterMythicPlusRun} from '../types'

export default function initializeCharacter(character: Character) {
    // item levels
    if (keys(character.equippedItems).length > 0) {
        let count = 0, itemLevels = 0
        for (let j = 0; j < slotOrder.length; j++) {
            const slot = slotOrder[j]
            const item = character.equippedItems[slot]
            if (item !== undefined) {
                itemLevels += item.itemLevel
                count++
                if (slot === InventorySlot.MainHand && character.equippedItems[InventorySlot.OffHand] === undefined) {
                    itemLevels += item.itemLevel
                    count++
                }
            }
        }

        const itemLevel = itemLevels / count
        if ((itemLevel - character.equippedItemLevel) < 1) {
            character.calculatedItemLevel = itemLevel.toFixed(1)
        }
    }

    if (character.calculatedItemLevel === undefined) {
        character.calculatedItemLevel = character.equippedItemLevel.toFixed(1)
    }

    // 226 = mythic  5
    // 213 = heroic  4
    // 200 = normal  3
    // 187 = lfr     2
    // 174 = ?       1
    // 161 = ?       0
    character.calculatedItemLevelQuality = Math.floor(Math.max(0, Math.min(6, (parseFloat(character.calculatedItemLevel) - 148) / 13)))

    // mythic+ seasons
    if (character.mythicPlus?.seasons) {
        for (let seasonId in seasonMap) {
            const season = seasonMap[seasonId];
            if (character.level >= season.MinLevel) {
                const characterSeason = character.mythicPlus.seasons[seasonId]
                if (characterSeason !== undefined) {
                    let total = 0, timed2 = 0, timed5 = 0, timed10 = 0, timed15 = 0
                    for (let i = 0; i < season.Orders.length; i++) {
                        for (let j = 0; j < season.Orders[i].length; j++) {
                            total++
                            const dungeonId = season.Orders[i][j]
                            const runs = characterSeason[dungeonId] || []
                            for (let k = 0; k < runs.length; k++) {
                                const run = runs[k] as CharacterMythicPlusRun
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
                        characterSeason['badge'] = '15'
                    }
                    else if (timed10 === total) {
                        characterSeason['badge'] = '10'
                    }
                    else if (timed5 === total) {
                        characterSeason['badge'] = '5'
                    }
                    else if (timed2 === total) {
                        characterSeason['badge'] = '2'
                    }
                }
            }
        }
    }
}
