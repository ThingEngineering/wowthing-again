import keys from 'lodash/keys'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import { get } from 'svelte/store'

import { userModifiedStore } from './user-modified'
import { difficultyMap, lockoutDifficultyOrder } from '@/data/difficulty'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import { manualStore, staticStore } from '@/stores'
import {
    CharacterCurrency,
    CharacterMythicPlusRunMember,
    UserCount,
    UserDataPet,
    WritableFancyStore,
} from '@/types'
import { InventorySlot, TypedArray } from '@/enums'
import base64ToRecord from '@/utils/base64-to-record'
import { getGenderedName } from '@/utils/get-gendered-name'
import getItemLevelQuality from '@/utils/get-item-level-quality'
import leftPad from '@/utils/left-pad'
import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores'
import type {
    Account,
    Character,
    CharacterMythicPlusRun,
    CharacterReputation,
    CharacterReputationReputation,
    Settings,
    UserData,
} from '@/types'
import type { StaticData } from '@/types/data/static'
import type { ManualDataSetCategory } from '@/types/data/manual'


export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            const modified = get(userModifiedStore).data.general
            url = url.replace('-0.json', `-${modified}.json`)
        }
        return url
    }

    get useAccountTags(): boolean {
        return some(get(this).data.accounts, (a: Account) => !!a.tag)
    }

    initialize(userData: UserData): void {
        // console.time('UserDataStore.initialize')

        // Background images
        userData.backgroundList = sortBy(
            Object.values(userData.backgrounds),
            (bg) => -bg.id
        )

        // Unpack packed data
        if (userData.mountsPacked !== null) {
            userData.hasMount = base64ToRecord(TypedArray.Uint16, userData.mountsPacked)
            userData.mountsPacked = null
        }

        if (userData.toysPacked !== null) {
            userData.hasToy = base64ToRecord(TypedArray.Int32, userData.toysPacked)
            userData.toysPacked = null
        }

        if (userData.petsRaw !== null) {
            userData.pets = {}
            userData.hasPet = {}
            for (const petId in userData.petsRaw) {
                userData.pets[petId] = userData.petsRaw[petId].map((petArray) => new UserDataPet(...petArray))
                userData.hasPet[petId] = true
            }
            userData.petsRaw = null
        }

        // Characters
        userData.characterMap = {}
        for (const character of userData.characters) {
            userData.characterMap[character.id] = character

            if (character.currenciesRaw) {
                character.currencies = {}
                for (const rawCurrency of character.currenciesRaw) {
                    const obj = new CharacterCurrency(...rawCurrency)
                    character.currencies[obj.id] = obj
                }
                character.currenciesRaw = null
            }

            if (character.specializationsRaw) {
                character.specializations = {}
                for (const specializationId in character.specializationsRaw) {
                    const specData: Record<number, number> = {}
                    for (const [tierId, , spellId] of character.specializationsRaw[specializationId].talents) {
                        specData[tierId] = spellId
                    }
                    character.specializations[specializationId] = specData
                }
                character.specializationsRaw = null
            }
        }

        // console.timeEnd('UserDataStore.initialize')
    }

    setup(
        settingsData: Settings,
        userData: UserData
    ): void {
        // console.time('UserDataStore.setup')

        const manualData = get(manualStore).data
        const staticData = get(staticStore).data
        
        // Initialize characters
        const allLockouts: Record<string, boolean> = {}
        for (const character of userData.characters) {
            this.initializeCharacter(staticData, character)

            for (const key of keys(character.lockouts)) {
                allLockouts[key] = true
            }
        }

        // Initialize guilds
        for (const guild of Object.values(userData.guilds)) {
            guild.realm = staticData.realms[guild.realmId] || staticData.realms[0]
        }

        // Pre-calculate lockouts
        userData.allLockouts = []
        userData.allLockoutsMap = {}
        for (const instanceDifficulty of keys(allLockouts)) {
            const [instanceId, difficultyId] = instanceDifficulty.split('-')
            const difficulty = difficultyMap[parseInt(difficultyId)]

            if (difficulty && instanceId) {
                userData.allLockouts.push({
                    difficulty,
                    instanceId: parseInt(instanceId),
                    key: instanceDifficulty,
                })
                userData.allLockoutsMap[instanceDifficulty] = userData.allLockouts[userData.allLockouts.length - 1]
            }
            else {
                console.log({instanceId, difficultyId, difficulty})
            }
        }

        userData.allLockouts = sortBy(
            userData.allLockouts,
            (diff/*: InstanceDifficulty*/) => {
                const instance = staticData.instances[diff.instanceId]
                if (!diff.difficulty || !instance) {
                    return 'z'
                }

                const orderIndex = lockoutDifficultyOrder.indexOf(diff.difficulty.id)
                return [
                    leftPad(100 - instance.expansion, 2, '0'),
                    leftPad(orderIndex >= 0 ? orderIndex : 99, 2, '0'),
                    instance.shortName,
                    diff.difficulty.shortName,
                ].join('|')
            }
        )

        userData.homeLockouts = []
        for (const instanceId of settingsData.layout.homeLockouts) {
            let found = false
            for (const difficulty of lockoutDifficultyOrder) {
                const id = userData.allLockoutsMap[`${instanceId}-${difficulty}`]
                if (id !== undefined) {
                    userData.homeLockouts.push(id)
                    found = true
                }
            }

            if (!found) {
                userData.homeLockouts.push({
                    difficulty: null,
                    instanceId,
                    key: `${instanceId}-`
                })
            }
        }

        // Generate set counts
        const setCounts = {
            mounts: {},
            pets: {},
            toys: {},
        }

        UserDataStore.doSetCounts(
            setCounts['mounts'],
            manualData.mountSets,
            userData.hasMount
        )
        UserDataStore.doSetCounts(
            setCounts['pets'],
            manualData.petSets,
            userData.hasPet
        )
        UserDataStore.doSetCounts(
            setCounts['toys'],
            manualData.toySets,
            userData.hasToy
        )

        this.update(state => {
            state.data.setCounts = setCounts
            return state
        })

        // console.timeEnd('UserDataStore.setup')
    }

    private initializeCharacter(staticData: StaticData, character: Character): void {
        // names
        character.className = getGenderedName(
            staticData.characterClasses[character.classId].name,
            character.gender
        )
        character.raceName = getGenderedName(
            staticData.characterRaces[character.raceId].name,
            character.gender
        )
        if (character.activeSpecId > 0) {
            character.specializationName = getGenderedName(
                staticData.characterSpecializations[character.activeSpecId].name,
                character.gender
            )
        }

        // realm
        character.realm = staticData.realms[character.realmId] || staticData.realms[0]
        
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
                                    run.memberObjects = (run.members || [])
                                        .map(m => new CharacterMythicPlusRunMember(...m))
                                }
                            }
                        }
                    }
                }
            }
        }

        character.mythicPlusSeasonScores = {}
        for (const seasonId in (character.mythicPlusSeasons ?? {})) {
            let total = 0
            for (const addonMap of Object.values(character.mythicPlusSeasons[seasonId])) {
                const scores = getDungeonScores(addonMap)
                total += scores.fortifiedFinal + scores.tyrannicalFinal
            }

            const rioScore = character.raiderIo?.[seasonId]?.['all'] || 0
            character.mythicPlusSeasonScores[seasonId] = Math.abs(total - rioScore) > 10 ? total : rioScore
        }
        
        // professions
        // - force Archaeology to 950 max skill
        if (character.professions?.[794] !== undefined) {
            character.professions[794][794].maxSkill = 950
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
                        repId = character.faction === 0 ? reputation.alliance?.id : reputation.horde?.id
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

    private static doSetCounts(
        setCounts: Record<string, UserCount>,
        categories: ManualDataSetCategory[][],
        userHas: Record<number, boolean>
    ): void {
        const overallData = setCounts['OVERALL'] = new UserCount()
        const seen: Record<number, boolean> = {}

        for (const category of categories) {
            if (category === null) {
                continue
            }

            const categoryData = setCounts[category[0].slug] = new UserCount()

            for (const set of category) {
                const setData = setCounts[`${category[0].slug}--${set.slug}`] = new UserCount()

                for (const group of set.groups) {
                    // We only want to increase some counts if the set is not
                    // unavailable
                    const doCategory = (
                        category[0].slug === 'unavailable' ||
                        (
                            set.slug !== 'unavailable' &&
                            group.name.indexOf('Unavailable') < 0
                        )
                    )
                    const groupData = setCounts[`${category[0].slug}--${set.slug}--${group.name}`] = new UserCount()

                    for (const things of group.things) {
                        const hasThing = some(things, (t) => userHas[t])
                        const seenThing = some(things, (t) => seen[t])

                        const doOverall = (
                            !seenThing &&
                            (
                                hasThing ||
                                (
                                    category[0].slug !== 'unavailable' &&
                                    doCategory
                                )
                            )
                        )

                        if (doCategory) {
                            categoryData.total++
                        }
                        if (doOverall) {
                            overallData.total++
                        }

                        setData.total++
                        groupData.total++

                        if (hasThing) {
                            if (doCategory) {
                                categoryData.have++
                            }
                            if (doOverall) {
                                overallData.have++
                            }

                            setData.have++
                            groupData.have++
                        }

                        for (const thing of things) {
                            seen[thing] = true
                        }
                    }
                }
            }
        }
    }
}

export const userStore = new UserDataStore()
