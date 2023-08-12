import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { get } from 'svelte/store'
import type { DateTime } from 'luxon'

import { userModifiedStore } from './user-modified'
import { difficultyMap, lockoutDifficultyOrder } from '@/data/difficulty'
import { seasonMap } from '@/data/dungeon'
import { slotOrder } from '@/data/inventory-slot'
import { itemStore, staticStore } from '@/stores'
import {
    Character,
    CharacterMythicPlusRunMember,
    Guild,
    UserDataCurrentPeriod,
    UserDataPet,
    WritableFancyStore,
} from '@/types'
import { InventorySlot, ItemBonusType, TypedArray } from '@/enums'
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
import type { ItemData, ItemDataItem } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'
import type { ContainsItems, UserItem } from '@/types/shared'


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

        // Characters
        userData.characterMap = {}
        userData.characters = []
        for (const charArray of (userData.charactersRaw || [])) {
            const character = new Character(...charArray)
            userData.characters.push(character)
            userData.characterMap[character.id] = character
        }
        userData.charactersRaw = null

        // Guilds
        userData.guildMap = {}
        for (const guildArray of (userData.guildsRaw || [])) {
            const guild = new Guild(...guildArray)
            userData.guildMap[guild.id] = guild
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

        const itemData = get(itemStore)
        const staticData = get(staticStore)
        
        // Initialize guilds
        for (const guild of Object.values(userData.guildMap)) {
            this.initializeGuild(itemData, guild)

            guild.realm = staticData.realms[guild.realmId] || staticData.realms[0]

            for (const [appearanceId, items] of Object.entries(guild.itemsByAppearanceId)) {
                (userData.itemsByAppearanceId[parseInt(appearanceId)] ||= [])
                    .push([guild, items]);
            }
            for (const [appearanceSource, items] of Object.entries(guild.itemsByAppearanceSource)) {
                (userData.itemsByAppearanceSource[appearanceSource] ||= [])
                    .push([guild, items]);
            }
            for (const [itemId, items] of Object.entries(guild.itemsById)) {
                (userData.itemsById[parseInt(itemId)] ||= [])
                    .push([guild, items]);
            }
        }

        // Initialize characters
        userData.itemsByAppearanceId = {}
        userData.itemsByAppearanceSource = {}
        userData.itemsById = {}

        const allLockouts: Record<string, boolean> = {}
        for (const character of userData.characters) {
            this.initializeCharacter(itemData, staticData, character)

            for (const key of Object.keys(character.lockouts || {})) {
                allLockouts[key] = true
            }

            if (userData.public || character.account?.enabled === true) {
                for (const [appearanceId, items] of Object.entries(character.itemsByAppearanceId)) {
                    (userData.itemsByAppearanceId[parseInt(appearanceId)] ||= [])
                        .push([character, items])
                }
                for (const [appearanceSource, items] of Object.entries(character.itemsByAppearanceSource)) {
                    (userData.itemsByAppearanceSource[appearanceSource] ||= [])
                        .push([character, items])
                }
                for (const [itemId, items] of Object.entries(character.itemsById)) {
                    (userData.itemsById[parseInt(itemId)] ||= [])
                        .push([character, items])
                }
            }
        }

        userData.allRegions = sortBy(
            uniq(
                userData.characters
                    .map((char) => char.realm.region)
            ),
            (region) => region
        )
        
        // Accounts
        userData.activeCharacters = []
        for (const character of userData.characters) {
            if (userData.public || character.account?.enabled === true) {
                userData.activeCharacters.push(character)
            }
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

    private initializeCharacter(itemData: ItemData, staticData: StaticData, character: Character): void {
        // account
        character.account = this.value.accounts[character.accountId]

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
        character.guild = this.value.guildMap[character.guildId]

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

        // item appearance data
        character.itemsByAppearanceId = {}
        character.itemsByAppearanceSource = {}
        character.itemsById = {}
        for (const characterItems of Object.values(character.itemsByLocation)) {
            for (const characterItem of characterItems) {
                (character.itemsById[characterItem.itemId] ||= [])
                    .push(characterItem);

                const item = itemData.items[characterItem.itemId]
                if (Object.values(item?.appearances || {}).length === 0) {
                    continue
                }

                this.setAppearanceData(itemData, character, characterItem, item)
            }
        }

        // console.log(character.realm.name, character.name, character.itemsByAppearanceId, character.itemsByAppearanceSource)
    }

    private initializeGuild(
        itemData: ItemData,
        guild: Guild
    ): void {
        // item appearance data
        guild.itemsByAppearanceId = {}
        guild.itemsByAppearanceSource = {}
        guild.itemsById = {}
        for (const guildItem of guild.items) {
            (guild.itemsById[guildItem.itemId] ||= [])
                .push(guildItem);

            const item = itemData.items[guildItem.itemId]
            if (Object.values(item?.appearances || {}).length === 0) {
                continue
            }

            this.setAppearanceData(itemData, guild, guildItem, item)
        }
    }

    private setAppearanceData(
        itemData: ItemData,
        userContainer: ContainsItems,
        userItem: UserItem,
        item: ItemDataItem
    ): void {
        let modifier = 0
        let priority = 999
        if (userItem.bonusIds.length > 0) {
            for (const bonusId of userItem.bonusIds) {
                const itemBonus = itemData.itemBonuses[bonusId]
                if (!(itemBonus?.bonuses?.length > 0)) {
                    continue
                }

                for (const [bonusType, ...bonusValues] of itemBonus.bonuses) {
                    if (bonusType === ItemBonusType.SetItemAppearanceModifier) {
                        const bonusPriority = bonusValues[1] || 0
                        if (bonusPriority < priority) {
                            modifier = bonusValues[0]
                            priority = bonusPriority
                        }
                    }
                }
            }
        }

        userItem.appearanceId = item.appearances[modifier]?.appearanceId
        if (userItem.appearanceId === undefined && modifier > 0) {
            modifier = 0
            userItem.appearanceId = item.appearances[modifier]?.appearanceId
        }
        userItem.appearanceModifier = modifier
        userItem.appearanceSource = `${userItem.itemId}_${modifier}`
        
        if (userItem.appearanceId !== undefined) {
            (userContainer.itemsByAppearanceId[userItem.appearanceId] ||= [])
                .push(userItem);
            (userContainer.itemsByAppearanceSource[userItem.appearanceSource] ||= [])
                .push(userItem);
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
