import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { get } from 'svelte/store'
import type { DateTime } from 'luxon'

import { userModifiedStore } from './user-modified'
import { difficultyMap, lockoutDifficultyOrder } from '@/data/difficulty'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import { staticStore } from '@/stores'
import {
    Character,
    CharacterCurrency,
    CharacterMythicPlusRunMember,
    UserDataCurrentPeriod,
    UserDataPet,
    WritableFancyStore,
} from '@/types'
import { InventorySlot, TypedArray } from '@/enums'
import base64ToRecord from '@/utils/base64-to-record'
import { getGenderedName } from '@/utils/get-gendered-name'
import getItemLevelQuality from '@/utils/get-item-level-quality'
import { leftPad } from '@/utils/formatting'
import { getDungeonScores } from '@/utils/mythic-plus/get-dungeon-scores'
import type {
    Account,
    CharacterMythicPlusRun,
    CharacterReputation,
    CharacterReputationReputation,
    Settings,
    UserData,
} from '@/types'
import type { StaticData } from '@/types/data/static'


export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            const modified = get(userModifiedStore).general
            url = url.replace('-0.json', `-${modified}.json`)
        }
        return url
    }

    get useAccountTags(): boolean {
        return some(get(this).accounts, (a: Account) => !!a.tag)
    }

    initialize(userData: UserData): void {
        console.time('UserDataStore.initialize')

        // Background images
        userData.backgroundList = sortBy(
            Object.values(userData.backgrounds),
            (bg) => -bg.id
        )

        // Periods
        userData.currentPeriod = Object.fromEntries(
            Object.entries(userData.currentPeriod)
                .map(([region, cp]) => [
                    region,
                    Object.assign(new UserDataCurrentPeriod(), cp)
                ])
        )

        // Unpack packed data
        if (userData.mountsPacked !== null) {
            userData.hasMount = base64ToRecord(TypedArray.Uint16, userData.mountsPacked)
            userData.mountsPacked = null
        }

        if (userData.toysPacked !== null) {
            userData.hasToyById = base64ToRecord(TypedArray.Uint16, userData.toysPacked)
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

        if (userData.charactersRaw !== null) {
            userData.characters = []
            for (const char of userData.charactersRaw) {
                const charObject = Object.assign(new Character(), char)
                charObject.initialize()
                userData.characters.push(charObject)
            }
            userData.charactersRaw = null
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

        // Temporary until static data loads
        userData.allRegions = [1, 2, 3, 4]

        console.timeEnd('UserDataStore.initialize')
    }

    setup(
        settingsData: Settings,
        userData: UserData
    ): void {
        console.time('UserDataStore.setup')

        const staticData = get(staticStore)
        
        // Initialize characters
        const allLockouts: Record<string, boolean> = {}
        for (const character of userData.characters) {
            this.initializeCharacter(staticData, character)

            for (const key of Object.keys(character.lockouts || {})) {
                allLockouts[key] = true
            }
        }

        userData.allRegions = sortBy(
            uniq(
                userData.characters
                    .map((char) => char.realm.region)
            ),
            (region) => region
        )

        // Initialize guilds
        for (const guild of Object.values(userData.guilds)) {
            guild.realm = staticData.realms[guild.realmId] || staticData.realms[0]
        }

        // Pre-calculate lockouts
        userData.allLockouts = []
        userData.allLockoutsMap = {}
        for (const instanceDifficulty of Object.keys(allLockouts)) {
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

        userData.hasToy = {}
        for (const toyIdString of Object.keys(userData.hasToyById)) {
            const toyId = parseInt(toyIdString)
            const toy = staticData.toysById[toyId]
            if (toy) {
                userData.hasToy[toy.itemId] = true
            }
            else {
                console.error('Missing toy id', toyId)
            }
        }

        console.timeEnd('UserDataStore.setup')
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
        
        // guild
        character.guild = this.value.guilds[character.guildId]

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

    public getCurrentPeriodForCharacter(
        now: DateTime,
        character: Character
    ): UserDataCurrentPeriod {
        const regionId = character.realm?.region || 1
        const period = this.value.currentPeriod[regionId]
        
        // Update the period if it's too old
        while (period.endTime < now) {
            period.id++
            period.startTime = period.startTime.plus({ days: 7 })
            period.endTime = period.endTime.plus({ days: 7 })
        }

        return period;
    }

    public getPeriodForCharacter(
        now: DateTime,
        character: Character,
        desiredPeriodId: number
    ) {
        const period = Object.assign(
            new UserDataCurrentPeriod(),
            this.getCurrentPeriodForCharacter(now, character)
        )

        while (period.id < desiredPeriodId) {
            period.id++
            period.startTime = period.startTime.plus({ days: 7 })
            period.endTime = period.endTime.plus({ days: 7 })
        }
        
        while (period.id > desiredPeriodId) {
            period.id--
            period.startTime = period.startTime.minus({ days: 7 })
            period.endTime = period.endTime.minus({ days: 7 })
        }

        return period
    }
}

export const userStore = new UserDataStore()
