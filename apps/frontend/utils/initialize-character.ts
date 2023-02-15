import { get } from 'svelte/store'

import getItemLevelQuality from './get-item-level-quality'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import { staticStore } from '@/stores/static'
import type { Character, CharacterMythicPlusRun, CharacterReputation, CharacterReputationReputation } from '@/types'
import { InventorySlot } from '@/enums'
import { CharacterMythicPlusRunMember } from '@/types'

export default function initializeCharacter(character: Character): void {
    const staticData = get(staticStore)

    // realm
    character.realm = staticData.realms[character.realmId]

    // item levels
    if (Object.keys(character.equippedItems).length > 0) {
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
        for (const seasonId in seasonMap) {
            const season = seasonMap[seasonId]
            if (character.level >= season.minLevel) {
                const characterSeason = character.mythicPlus.seasons[seasonId]
                if (characterSeason !== undefined) {
                    for (let i = 0; i < season.orders.length; i++) {
                        for (let j = 0; j < season.orders[i].length; j++) {
                            const dungeonId = season.orders[i][j]
                            const runs = characterSeason[dungeonId] || []
                            for (let runIndex = 0; runIndex < runs.length; runIndex++) {
                                const run = runs[runIndex] as CharacterMythicPlusRun

                                // Members are packed arrays, convert them to useful objects
                                run.memberObjects = run.members.map(m => new CharacterMythicPlusRunMember(...m))
                            }
                        }
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
