import every from 'lodash/every'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { DateTime } from 'luxon'

import { covenantSlugMap } from '@/data/covenant'
import { factionMap } from '@/data/faction'
import { UserCount, WritableFancyStore } from '@/types'
import {
    ManualDataSetCategory,
    ManualDataSharedItem,
    ManualDataSharedVendor,
    ManualDataTransmogCategory,
    ManualDataVendorCategory,
    ManualDataZoneMapCategory,
} from '@/types/data/manual'
import { FarmResetType, PlayableClass, PlayableClassMask, RewardType } from '@/types/enums'
import { getNextBiWeeklyReset, getNextDailyReset, getNextWeeklyReset } from '@/utils/get-next-reset'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { ZoneMapState } from '@/stores/local-storage'
import type { DropStatus, FancyStore, FarmStatus, Settings, UserAchievementData, UserData } from '@/types'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { ManualData, ManualDataSetCategoryArray } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'


type classMaskStrings = keyof typeof PlayableClassMask

export class ManualDataStore extends WritableFancyStore<ManualData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-manual')
    }

    initialize(data: ManualData): void {
        data.shared = {
            items: {},
            vendors: {},
            vendorsByMap: {},
            vendorsByTag: {},
        }
        data.transmog = {
            sets: [],
        }
        data.vendors = {
            sets: [],
        }
        data.zoneMaps = {
            sets: [],
        }

        for (const itemArray of data.rawSharedItems) {
            const obj = new ManualDataSharedItem(...itemArray)
            data.shared.items[obj.id] = obj
        }
        data.rawSharedItems = null

        for (const vendorArray of data.rawSharedVendors) {
            const obj = new ManualDataSharedVendor(...vendorArray)
            data.shared.vendors[obj.id] = obj
            
            for (const mapName of Object.keys(obj.locations)) {
                data.shared.vendorsByMap[mapName] ||= []
                data.shared.vendorsByMap[mapName].push(obj.id)
            }

            for (const tag of obj.tags) {
                data.shared.vendorsByTag[tag] ||= []
                data.shared.vendorsByTag[tag].push(obj.id)
            }
        }
        data.rawSharedVendors = null

        for (const categories of data.rawTransmogSets) {
            if (categories === null) {
                data.transmog.sets.push(null)
            }
            else {
                data.transmog.sets.push(
                    categories.map(
                        (catArray) => catArray === null ? null : new ManualDataTransmogCategory(...catArray)
                    )
                )
            }
        }
        data.rawTransmogSets = null

        for (const categories of data.rawVendorSets) {
            if (categories === null) {
                data.vendors.sets.push(null)
            }
            else {
                data.vendors.sets.push(
                    categories.map(
                        (catArray) => catArray === null ? null : new ManualDataVendorCategory(...catArray)
                    )
                )
            }
        }
        data.rawVendorSets = null

        for (const categories of data.rawZoneMapSets) {
            if (categories === null) {
                data.zoneMaps.sets.push(null)
            }
            else {
                data.zoneMaps.sets.push(
                    categories.map(
                        (catArray) => catArray === null ? null : new ManualDataZoneMapCategory(...catArray)
                    )
                )
            }
        }
        data.rawZoneMapSets = null

        data.mountSets = ManualDataStore.fixSets(data.rawMountSets)
        data.petSets = ManualDataStore.fixSets(data.rawPetSets)
        data.toySets = ManualDataStore.fixSets(data.rawToySets)

        data.rawMountSets = null
        data.rawPetSets = null
        data.rawToySets = null

        console.log(data)
    }
    
    private static fixSets(allSets: ManualDataSetCategoryArray[][]): ManualDataSetCategory[][] {
        const newSets: ManualDataSetCategory[][] = []

        for (const sets of allSets) {
            if (sets === null) {
                newSets.push(null)
                continue
            }

            const actualSets = sets.map(
                (set) => new ManualDataSetCategory(...set)
            )

            newSets.push(
                sortBy(
                    actualSets,
                    (set) => [
                        set.name.startsWith('<') ? 0 : 1,
                        set.name.startsWith('>') ? 1 : 0,
                    ]
                )
            )

            for (const set of newSets[newSets.length - 1]) {
                if (set.name.startsWith('<') || set.name.startsWith('>')) {
                    set.name = set.name.substring(1)
                }
            }
        }

        return newSets
    }

    setup(
        settings: Settings,
        manualData: ManualData,
        staticData: StaticData,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData,
        zoneMapState: ZoneMapState,
    ): void {
        // console.time('ManualDataStore.setup')

        this.update(state => {
            this.setupTransmog(
                state,
                manualData
            )
            
            this.setupZoneMaps(
                state,
                settings,
                manualData,
                staticData,
                userData,
                userAchievementData,
                userQuestData,
                userTransmogData,
                zoneMapState
            )
            
            return state
        })

        // console.timeEnd('ManualDataStore.setup')
    }

    private setupTransmog(
        state: FancyStore<ManualData>,
        manualData: ManualData
    ) {
        const newSets: ManualDataTransmogCategory[][] = []

        for (const sets of manualData.transmog.sets) {
            if (sets === null) {
                newSets.push(null)
            }
            else {
                newSets.push(
                    sortBy(
                        sets,
                        (set) => [
                            set.name.startsWith('<') ? 0 : 1,
                            set.name.startsWith('>') ? 1 : 0,
                        ]
                    )
                )

                for (const set of newSets[newSets.length - 1]) {
                    if (set.name.startsWith('<') || set.name.startsWith('>')) {
                        set.name = set.name.substring(1)
                    }
                }
            }
        }

        state.data.transmog.sets = newSets
    }

    private setupZoneMaps(
        state: FancyStore<ManualData>,
        settings: Settings,
        manualData: ManualData,
        staticData: StaticData,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData,
        options: ZoneMapState,
    ) {

        const classMask = getTransmogClassMask(settings)
        const now = DateTime.utc()

        const farmData: Record<string, FarmStatus[]> = {}
        const setCounts: Record<string, UserCount> = {}
        const typeCounts: Record<string, Record<number, UserCount>> = {}

        const shownCharacters = filter(
            userData.characters,
            (c) => settings.characters.hiddenCharacters.indexOf(c.id) === -1 &&
                userData.accounts?.[c.accountId]?.enabled !== false
        )
        const overallCounts = setCounts['OVERALL'] = new UserCount()
        const resetMap = fromPairs(
            toPairs(userQuestData.characters)
                .map(c => [
                    c[0],
                    {
                        daily: getNextDailyReset(
                            c[1].scannedAt,
                            userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                        ),
                        biWeekly: getNextBiWeeklyReset(
                            c[1].scannedAt,
                            userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                        ),
                        weekly: getNextWeeklyReset(
                            c[1].scannedAt,
                            userData.characterMap[parseInt(c[0])]?.realm?.region ?? 1
                        )
                    }
                ])
        )

        for (const maps of manualData.zoneMaps.sets) {
            if (maps === null) {
                continue
            }

            const categoryCounts = setCounts[maps[0].slug] = new UserCount()
            const categorySeen: Record<number, Record<number, boolean>> = {}

            const categoryCharacters = filter(
                shownCharacters,
                (char) => (
                    char.level >= maps[0].minimumLevel &&
                    (
                        maps[0].requiredQuestIds.length === 0 ||
                        some(
                            maps[0].requiredQuestIds,
                            (questId) => userQuestData.characters[char.id].quests.get(questId)
                        )
                    )
                )
            )

            for (const map of maps.slice(1)) {
                if (map === null) {
                    continue
                }

                const mapKey = `${maps[0].slug}--${map.slug}`
                const mapCounts = setCounts[mapKey] = new UserCount()
                const mapTypeCounts: Record<number, UserCount> = typeCounts[mapKey] = {
                    [RewardType.Achievement]: new UserCount(),
                    [RewardType.Item]: new UserCount(),
                    [RewardType.Mount]: new UserCount(),
                    [RewardType.Pet]: new UserCount(),
                    [RewardType.Quest]: new UserCount(),
                    [RewardType.Toy]: new UserCount(),
                    [RewardType.Transmog]: new UserCount(),
                }

                const mapSeen: Record<string, Record<number, boolean>> = {}

                let mapClassMask = 0
                const activeClasses = Object.entries(options.classFilters[mapKey] || {})
                    .filter(([, value]) => value === true)
                    .map(([key, ]) => parseInt(key))

                for (const classId of activeClasses) {
                    mapClassMask |= PlayableClassMask[PlayableClass[classId] as classMaskStrings]
                }

                const eligibleCharacters = filter(
                    categoryCharacters,
                    (char) => (
                        char.level >= map.minimumLevel &&
                        (
                            map.requiredQuestIds.length === 0 ||
                            some(
                                map.requiredQuestIds,
                                (questId) => userQuestData.characters[char.id].quests.get(questId)
                            )
                        ) &&
                        (
                            mapClassMask === 0 ||
                            (mapClassMask & staticData.characterClasses[char.classId].mask) > 0
                        )
                    )
                )

                const farms = [...map.farms]
                for (const vendorId of (manualData.shared.vendorsByMap[map.mapName] || [])) {
                    farms.push(...manualData.shared.vendors[vendorId].asFarms(staticData, map.mapName))
                }

                const farmStatuses: FarmStatus[] = []
                for (const farm of farms) {
                    const farmStatus: FarmStatus = {
                        characters: [],
                        drops: [],
                        need: false,
                    }

                    let expiredFunc: (characterId: number) => boolean
                    if (farm.reset === FarmResetType.Weekly) {
                        expiredFunc = (characterId) => resetMap[characterId].weekly < now
                    }
                    else if (farm.reset === FarmResetType.BiWeekly) {
                        expiredFunc = (characterId) => resetMap[characterId].biWeekly < now
                    }
                    else if (farm.reset === FarmResetType.Daily) {
                        expiredFunc = (characterId) => resetMap[characterId].daily < now
                    }
                    else if (farm.reset === FarmResetType.None) {
                        expiredFunc = () => true
                    }
                    else {
                        expiredFunc = () => false
                    }

                    let farmCharacters = eligibleCharacters
                    if (farm.minimumLevel > 0) {
                        farmCharacters = filter(
                            farmCharacters,
                            (c) => c.level >= farm.minimumLevel
                        )
                    }
                    if (farm.requiredQuestIds?.length > 0) {
                        farmCharacters = filter(
                            farmCharacters,
                            (c) => some(
                                farm.requiredQuestIds,
                                (q) => userQuestData.characters[c.id].quests.get(q)
                            )
                        )
                    }
                    if (farm.faction) {
                        farmCharacters = filter(
                            farmCharacters,
                            (c) => c.faction === factionMap[farm.faction]
                        )
                    }

                    for (const drop of farm.drops) {
                        let dropCharacters = farmCharacters
                        const dropStatus: DropStatus = {
                            need: false,
                            skip: false,
                            validCharacters: true,
                            characterIds: [],
                            completedCharacterIds: [],
                        }

                        let fixedType = drop.type
                        switch (drop.type) {
                            case RewardType.Achievement:
                                if (drop.subType > 0) {
                                    if (!userAchievementData.criteria[drop.subType]) {
                                        dropStatus.need = true
                                    }
                                }
                                else {
                                    dropStatus.need = userAchievementData.achievements[drop.id] === undefined
                                }
                                break

                            case RewardType.Item:
                                dropStatus.need = true
                                break

                            case RewardType.Mount:
                                if (!userData.hasMount[drop.id] &&
                                    !userData.addonMounts[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case RewardType.Pet:
                                if (!userData.hasPet[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case RewardType.Quest:
                                if (!every(userQuestData.characters, (c) => c.quests.get(drop.id) !== undefined)) {
                                    dropStatus.need = true
                                }
                                break

                            case RewardType.Toy:
                                if (!userData.hasToy[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case RewardType.Armor:
                            case RewardType.Cosmetic:
                            case RewardType.Weapon:
                            case RewardType.Transmog:
                                if (!userTransmogData.userHas[manualData.shared.items[drop.id]?.appearanceId ?? 0]) {
                                    dropStatus.need = true
                                }
                                fixedType = RewardType.Transmog
                                break
                        }

                        dropStatus.skip = (
                            (drop.type === RewardType.Achievement && !options.trackAchievements) ||
                            (drop.type === RewardType.Mount && !options.trackMounts) ||
                            (drop.type === RewardType.Pet && !options.trackPets) ||
                            (drop.type === RewardType.Quest && !options.trackQuests) ||
                            (drop.type === RewardType.Toy && !options.trackToys) ||
                            (transmogTypes.indexOf(drop.type) >= 0 && !options.trackTransmog)
                        )

                        if (!dropStatus.skip) {
                            if (categorySeen[drop.type] === undefined) {
                                categorySeen[drop.type] = {}
                            }
                            if (mapSeen[drop.type] === undefined) {
                                mapSeen[drop.type] = {}
                            }

                            const seenId = drop.type === RewardType.Achievement ? drop.subType : drop.id

                            overallCounts.total++
                            if (categorySeen[drop.type][seenId] === undefined) {
                                categoryCounts.total++
                            }
                            if (mapSeen[drop.type][seenId] === undefined) {
                                mapCounts.total++
                                mapTypeCounts[fixedType].total++
                            }

                            if (!dropStatus.need) {
                                overallCounts.have++
                                if (categorySeen[drop.type][seenId] === undefined) {
                                    categoryCounts.have++
                                }
                                if (mapSeen[drop.type][seenId] === undefined) {
                                    mapCounts.have++
                                    mapTypeCounts[fixedType].have++
                                }
                            }

                            categorySeen[drop.type][seenId] = true

                            if (!mapSeen[drop.type][seenId]) {
                                mapSeen[drop.type][seenId] = true
                            }
                        }

                        if (dropStatus.need && !dropStatus.skip) {
                            // Filter for class mask
                            if (drop.classMask > 0) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => (
                                        (drop.classMask & classMask) > 0 &&
                                        (drop.classMask & staticData.characterClasses[c.classId].mask) > 0
                                    )
                                )
                            }

                            if (drop.limit?.length > 0) {
                                switch (drop.limit[0]) {
                                    case 'class':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => some(
                                                drop.limit.slice(1),
                                                (cl) => staticData.characterClassesBySlug[cl].id === c.classId
                                            )
                                        )
                                        break;

                                    case 'covenant':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => c.shadowlands?.covenantId === covenantSlugMap[drop.limit[1]].id
                                        )
                                        break

                                    case 'faction':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => c.faction === factionMap[drop.limit[1]]
                                        )
                                        break
                                }
                            }

                            // Filter again for pre-req quests
                            if (drop.requiredQuestId > 0) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id].quests.get(drop.requiredQuestId)
                                )
                            }

                            // Filter again for characters that haven't completed the quest
                            if (drop.type === RewardType.Quest) {
                                if (map.slug === 'mechagon') {
                                    dropCharacters = filter(dropCharacters, (c) => c.name === 'Wataki')
                                }

                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id].quests.get(drop.id) === undefined,
                                )

                                if (!dropStatus.skip && dropCharacters.length === 0) {
                                    dropStatus.need = false
                                }
                            }

                            dropStatus.validCharacters = dropCharacters.length > 0

                            // And finally, filter for characters that aren't locked
                            if (drop.questIds) {

                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => expiredFunc(c.id) ||
                                        every(
                                            drop.questIds,
                                            (q) => userQuestData.characters[c.id]?.dailyQuests?.get(q) === undefined
                                        )
                                )
                            }

                            for (const character of dropCharacters) {
                                if (
                                    expiredFunc(character.id) ||
                                    every(
                                        farm.questIds,
                                        (q) => userQuestData.characters[character.id]?.dailyQuests?.get(q) === undefined
                                    )
                                ) {
                                    dropStatus.characterIds.push(character.id)
                                }
                                else {
                                    dropStatus.completedCharacterIds.push(character.id)
                                }
                            }

                            /*dropStatus.characterIds = filter(
                                dropCharacters,
                                (c) => resetMap[c.id] < now ||
                                    every(farm.questIds, (q) => userQuestData.characters[c.id]?.dailyQuests?.get(q) === undefined)
                            ).map(c => c.id)*/

                            // We don't really need it if no characters are on the list
                            // - ok we kinda do so we can see unfinished things
                            //if (dropStatus.characterIds.length === 0) {
                            //    dropStatus.need = false
                            //}
                        }

                        farmStatus.drops.push(dropStatus)
                    } // for drop of farm.drops

                    farmStatus.need = some(farmStatus.drops, (d) => d.need && !d.skip)

                    const characterIds: Record<number, RewardType[]> = {}

                    for (let dropIndex = 0; dropIndex < farmStatus.drops.length; dropIndex++) {
                        const dropStatus = farmStatus.drops[dropIndex]
                        for (const characterId of dropStatus.characterIds) {
                            if (characterIds[characterId] === undefined) {
                                characterIds[characterId] = []
                            }
                            characterIds[characterId].push(farm.drops[dropIndex].type)
                        }
                    }

                    farmStatus.characters = toPairs(characterIds)
                        .map(p => ({
                            id: parseInt(p[0]),
                            types: uniq(p[1]),
                        }))

                    farmStatuses.push(farmStatus)
                }

                farmData[mapKey] = farmStatuses
            } // category of categories.slice(1)
        } // categories of zoneMapData.sets

        state.data.zoneMaps.counts = setCounts
        state.data.zoneMaps.farmStatus = farmData
        state.data.zoneMaps.typeCounts = typeCounts
    }
}

export const manualStore = new ManualDataStore()

const transmogTypes: RewardType[] = [
    RewardType.Armor,
    RewardType.Cosmetic,
    RewardType.Weapon,
]
