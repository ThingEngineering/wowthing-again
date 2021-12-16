import keys from 'lodash/keys'
import {get} from 'svelte/store'

import getItemLevelQuality from './get-item-level-quality'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import {staticStore} from '@/stores/static'
import type { Character, CharacterMythicPlusRun, CharacterReputation, CharacterReputationReputation } from '@/types'
import { InventorySlot } from '@/types/enums'
import {CharacterMythicPlusRunMember} from '@/types'

export default function initializeCharacter(character: Character): void {
    const staticData = get(staticStore).data

    // realm
    character.realm = staticData.realms[character.realmId]

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
            if (character.level >= season.minLevel) {
                const characterSeason = character.mythicPlus.seasons[seasonId]
                if (characterSeason !== undefined) {
                    let total = 0,
                        timed2 = 0,
                        timed5 = 0,
                        timed10 = 0,
                        timed15 = 0
                    for (let i = 0; i < season.orders.length; i++) {
                        for (let j = 0; j < season.orders[i].length; j++) {
                            total++
                            const dungeonId = season.orders[i][j]
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
                        character.mythicPlus.seasonBadges[season.id] = '15'
                    } else if (timed10 === total) {
                        character.mythicPlus.seasonBadges[season.id] = '10'
                    } else if (timed5 === total) {
                        character.mythicPlus.seasonBadges[season.id] = '5'
                    } else if (timed2 === total) {
                        character.mythicPlus.seasonBadges[season.id] = '2'
                    }
                }
            }
        }
    }

    // reputation sets
    character.reputationData = {}
    for (const category of staticData.reputationSets) {
        if (category === null) {
            continue
        }

        const catData: CharacterReputation = {
            sets: [],
        }

        for (const sets of category.reputations) {
            const setsData: CharacterReputationReputation[] = []

            for (const reputation of sets) {
                let repId: number
                if (reputation.both) {
                    repId = reputation.both.id
                }
                else {
                    repId = character.faction === 0 ? reputation.alliance.id : reputation.horde.id
                }

                setsData.push({
                    reputationId: repId,
                    value: character.reputations?.[repId] ?? -1,
                })
            }

            catData.sets.push(setsData)
        }

        character.reputationData[category.slug] = catData
    }
}
