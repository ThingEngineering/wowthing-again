import every from 'lodash/every'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import { DateTime } from 'luxon'
import { get } from 'svelte/store'

import { classByArmorTypeString } from '@/data/character-class'
import { Constants } from '@/data/constants'
import { covenantSlugMap } from '@/data/covenant'
import { factionMap } from '@/data/faction'
import { questToLockout } from '@/data/quests'
import { itemStore, staticStore } from '@/stores'
import { UserCount, WritableFancyStore } from '@/types'
import {
    ManualDataHeirloomGroup,
    ManualDataIllusionGroup,
    ManualDataSetCategory,
    ManualDataSharedItemSet,
    ManualDataSharedVendor,
    ManualDataTransmogCategory,
    ManualDataTransmogSetCategory,
    ManualDataVendorCategory,
    ManualDataVendorGroup,
    ManualDataVendorItem,
    ManualDataZoneMapCategory,
} from '@/types/data/manual'
import { Faction, FarmResetType, FarmType, PlayableClass, PlayableClassMask, RewardType } from '@/enums'
import { getNextBiWeeklyReset, getNextDailyReset, getNextWeeklyReset } from '@/utils/get-next-reset'
import { getCurrencyCosts, getSetCurrencyCostsString } from '@/utils/get-currency-costs'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import { getVendorDropStats } from '@/utils/get-vendor-drop-stats'
import type { ZoneMapState } from '@/stores/local-storage'
import type { DropStatus, FancyStore, FarmStatus, Settings, UserAchievementData, UserData } from '@/types'
import type { UserQuestData, UserTransmogData } from '@/types/data'
import type { ManualData, ManualDataSetCategoryArray } from '@/types/data/manual'
import { professionSlugToId } from '@/data/professions'


type classMaskStrings = keyof typeof PlayableClassMask

export class ManualDataStore extends WritableFancyStore<ManualData> {
    get dataUrl(): string {
        return document.getElementById('app').getAttribute('data-manual')
    }

    initialize(data: ManualData): void {
        console.time('ManualDataStore.initialize')

        data.shared = {
            itemSets: [],
            itemSetsByTag: {},

            vendors: {},
            vendorsByMap: {},
            vendorsByTag: {},
        }
        data.tagsById = {}
        data.tagsByName = {}
        data.transmog = {
            sets: [],
            setsV2: [],
        }
        data.vendors = {
            sets: [],
        }
        data.zoneMaps = {
            sets: [],
        }

        for (const [tagId, tagName] of data.rawTags) {
            data.tagsById[tagId] = tagName
            data.tagsByName[tagName] = tagId
        }
        data.rawTags = null

        for (const itemSetArray of data.rawSharedItemSets) {
            const obj = new ManualDataSharedItemSet(...itemSetArray)
            data.shared.itemSets.push(obj)

            for (const tag of obj.tags) {
                data.shared.itemSetsByTag[tag] ||= []
                data.shared.itemSetsByTag[tag].push(obj)
            }
        }
        data.rawSharedItemSets = null

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

        data.heirlooms = data.rawHeirloomGroups.map(
            (groupArray) => new ManualDataHeirloomGroup(...groupArray)
        )
        data.rawHeirloomGroups = null

        data.illusions = data.rawIllusionGroups.map(
            (groupArray) => new ManualDataIllusionGroup(...groupArray)
        )
        data.rawIllusionGroups = null

        data.transmog.sets = data.rawTransmogSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataTransmogCategory(...catArray)
            )
        )
        data.rawTransmogSets = null

        data.transmog.setsV2 = data.rawTransmogSetsV2.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataTransmogSetCategory(...catArray)
            )
        )
        data.rawTransmogSetsV2 = null

        data.vendors.sets = data.rawVendorSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataVendorCategory(...catArray)
            )
        )
        data.rawVendorSets = null

        data.zoneMaps.sets = data.rawZoneMapSets.map(
            (categories) => categories === null ? null : categories.map(
                (catArray) => catArray === null ? null : new ManualDataZoneMapCategory(...catArray)
            )
        )
        data.rawZoneMapSets = null

        data.mountSets = this.fixCollectionSets(data.rawMountSets)
        data.petSets = this.fixCollectionSets(data.rawPetSets)
        data.toySets = this.fixCollectionSets(data.rawToySets)
        
        data.transmog.sets = this.fixTransmogSets(data.transmog.sets)
        data.transmog.setsV2 = this.fixTransmogSetsV2(data.transmog.setsV2)

        data.rawMountSets = null
        data.rawPetSets = null
        data.rawToySets = null
        
        console.timeEnd('ManualDataStore.initialize')
    }
    
    private fixCollectionSets(
        allSets: ManualDataSetCategoryArray[][]
    ): ManualDataSetCategory[][] {
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
    
    private fixTransmogSets(
        allSets: ManualDataTransmogCategory[][]
    ): ManualDataTransmogCategory[][] {
        const newSets: ManualDataTransmogCategory[][] = []

        for (const sets of allSets) {
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

        return newSets
    }

    private fixTransmogSetsV2(
        allSets: ManualDataTransmogSetCategory[][]
    ): ManualDataTransmogSetCategory[][] {
        const newSets: ManualDataTransmogSetCategory[][] = []

        for (const sets of allSets) {
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

        return newSets
    }

    setup(
        settings: Settings,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData,
        zoneMapState: ZoneMapState,
    ): void {
        console.time('ManualDataStore.setup')

        this.update(state => {
            console.time('ManualDataStore.setupVendors')
            this.setupVendors(state)
            console.timeEnd('ManualDataStore.setupVendors')
            
            console.time('ManualDataStore.setupZoneMaps')
            this.setupZoneMaps(
                state,
                settings,
                userData,
                userAchievementData,
                userQuestData,
                userTransmogData,
                zoneMapState
            )
            console.timeEnd('ManualDataStore.setupZoneMaps')

            return state
        })

        console.timeEnd('ManualDataStore.setup')
    }

    private setupVendors(
        state: FancyStore<ManualData>
    )
    {
        const itemData = get(itemStore).data
        const staticData = get(staticStore).data
        // console.time('setupVendors')

        for (const vendor of Object.values(state.data.shared.vendors)) {
            vendor.createFarmData(itemData, state.data, staticData)
        }

        for (const categories of state.data.vendors.sets) {
            if (categories === null) {
                continue
            }
            
            for (const category of categories) {
                if (category === null || (category.vendorMaps.length === 0 && category.vendorTags.length === 0)) {
                    continue
                }

                const autoSeen: Record<string, ManualDataVendorItem> = {}

                // Remove any auto groups
                category.groups = category.groups.filter((group) => group.auto !== true)

                // Find useful vendors
                const vendorIds: number[] = []
                for (const mapName of category.vendorMaps) {
                    vendorIds.push(...(state.data.shared.vendorsByMap[mapName] || []))
                }
                for (const tagName of category.vendorTags) {
                    vendorIds.push(...(state.data.shared.vendorsByTag[tagName] || []))
                }

                const autoGroups: Record<string, ManualDataVendorGroup> = {}

                for (const vendorId of vendorIds) {
                    const vendor = state.data.shared.vendors[vendorId]

                    let setPosition = 0;
                    for (let setIndex = 0; setIndex < vendor.sets.length; setIndex++) {
                        const set = vendor.sets[setIndex]
                        const groupKey = `${set.sortKey ? '09' + set.sortKey : 10 + setIndex}${set.name}`
                        
                        if (set.range[1] > 0) {
                            setPosition = set.range[1]
                        }
                        
                        let setEnd = setPosition + set.range[0]
                        if (set.range[0] === -1) {
                            setEnd = vendor.sells.length
                        }

                        const autoGroup = autoGroups[groupKey] ||= new ManualDataVendorGroup(set.name, [], true)
                        for (let itemIndex = setPosition; itemIndex < setEnd; itemIndex++) {
                            setPosition++;

                            const item = vendor.sells[itemIndex]
                            const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`
                            const autoItem = autoSeen[seenKey]
                            if (!autoItem) {
                                autoGroup.sells.push(item)
                                autoSeen[seenKey] = item
                            }
                            else if (autoItem.faction !== Faction.Both && item.faction !== autoItem.faction) {
                                autoItem.faction = Faction.Both
                            }
                        }
                    }

                    for (const item of vendor.sells) {
                        let groupKey: string
                        let groupName: string

                        if (item.type === RewardType.Illusion) {
                            [groupKey, groupName] = ['00illusions', 'Illusions']
                        }
                        else if (item.type === RewardType.Mount) {
                            [groupKey, groupName] = ['00mounts', 'Mounts']
                        }
                        else if (item.type === RewardType.Pet) {
                            [groupKey, groupName] = ['00pets', 'Pets']
                        }
                        else if (item.type === RewardType.Toy) {
                            [groupKey, groupName] = ['00toys', 'Toys']
                        }
                        else if (item.type === RewardType.Armor) {
                            [groupKey, groupName] = ['80armor', 'Armor']
                        }
                        else if (item.type === RewardType.Weapon) {
                            [groupKey, groupName] = ['80weapons', 'Weapons']
                        }
                        else if (item.type === RewardType.Cosmetic || item.type === RewardType.Transmog) {
                            [groupKey, groupName] = ['90transmog', 'Transmog']
                        }

                        item.faction = vendor.faction
                        item.sortedCosts = getCurrencyCosts(itemData, staticData, item.costs)

                        if (groupKey) {
                            const autoGroup = autoGroups[groupKey] ||= new ManualDataVendorGroup(groupName, [], true)

                            const seenKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`
                            const autoItem = autoSeen[seenKey]
                            if (!autoItem) {
                                autoGroup.sells.push(item)
                                autoSeen[seenKey] = item
                            }
                            else if (autoItem.faction !== Faction.Both && item.faction !== autoItem.faction) {
                                autoItem.faction = Faction.Both
                            }
                        }
                    }
                }

                const groups = Object.entries(autoGroups)
                groups.sort()
                category.groups = groups.map(([, group]) => group)
            }
        }

        // console.timeEnd('setupVendors')
    }

    private setupZoneMaps(
        state: FancyStore<ManualData>,
        settings: Settings,
        userData: UserData,
        userAchievementData: UserAchievementData,
        userQuestData: UserQuestData,
        userTransmogData: UserTransmogData,
        options: ZoneMapState,
    ) {
        const itemData = get(itemStore).data
        const manualData = this.value.data
        const staticData = get(staticStore).data

        const classMask = getTransmogClassMask(settings)
        const masochist = settings.transmog.completionistMode
        const now = DateTime.utc()

        const farmData: Record<string, FarmStatus[]> = {}
        const setCounts: Record<string, UserCount> = {}
        const typeCounts: Record<string, Record<number, UserCount>> = {}

        const shownCharacters = filter(
            userData.characters,
            (c) =>
                settings.characters.hiddenCharacters.indexOf(c.id) === -1 &&
                settings.characters.ignoredCharacters.indexOf(c.id) === -1 &&
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
                            (questId) => userQuestData.characters[char.id]?.quests?.get(questId)
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
                    [RewardType.Currency]: new UserCount(),
                    [RewardType.Illusion]: new UserCount(),
                    [RewardType.Item]: new UserCount(),
                    [RewardType.Mount]: new UserCount(),
                    [RewardType.Pet]: new UserCount(),
                    [RewardType.Quest]: new UserCount(),
                    [RewardType.Toy]: new UserCount(),
                    [RewardType.Transmog]: new UserCount(),
                    [RewardType.SetSpecial]: new UserCount(),
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
                                (questId) => userQuestData.characters[char.id]?.quests?.get(questId)
                            )
                        ) &&
                        (
                            mapClassMask === 0 ||
                            (mapClassMask & staticData.characterClasses[char.classId].mask) > 0
                        ) &&
                        (
                            options.maxLevelOnly === false ||
                            char.level === Constants.characterMaxLevel
                        )
                    )
                )

                const farms = [...map.farms]
                for (const vendorId of (manualData.shared.vendorsByMap[map.mapName] || [])) {
                    farms.push(...manualData.shared.vendors[vendorId].asFarms(map.mapName))
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
                        expiredFunc = (characterId) => resetMap[characterId]?.weekly < now
                    }
                    else if (farm.reset === FarmResetType.BiWeekly) {
                        expiredFunc = (characterId) => resetMap[characterId]?.biWeekly < now
                    }
                    else if (farm.reset === FarmResetType.Daily) {
                        expiredFunc = (characterId) => resetMap[characterId]?.daily < now
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
                                (q) => userQuestData.characters[c.id]?.quests?.get(q)
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

                            case RewardType.Currency:
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
                                if (!every(
                                        userQuestData.characters,
                                        (char) => char?.quests?.get(drop.id) !== undefined)
                                    ) {
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
                                if (drop.appearanceIds?.length > 0) {
                                    dropStatus.need = some(
                                        drop.appearanceIds[0],
                                        (appearanceId) => !userTransmogData.userHas[appearanceId]
                                    )
                                }
                                else {
                                    const itemAppearances = itemData.items[drop.id]?.appearances || {}
                                    let appearanceId = itemAppearances?.[0]?.appearanceId || 0
                                    // If there's no default appearanceId, check for there only being one possibility
                                    if (appearanceId === 0) {
                                        const keys = Object.keys(itemAppearances)
                                        if (keys.length === 1) {
                                            appearanceId = itemAppearances[parseInt(keys[0])].appearanceId
                                        }
                                    }
                                    
                                    if (!userTransmogData.userHas[appearanceId]) {
                                        dropStatus.need = true
                                    }
                                }
                                fixedType = RewardType.Transmog
                                break
                            
                            case RewardType.Illusion:
                                dropStatus.need = userTransmogData.hasIllusion[drop.appearanceIds[0][0]]
                                break

                            case RewardType.SetSpecial:
                                [dropStatus.setHave, dropStatus.setNeed] = getVendorDropStats(
                                    itemData,
                                    userData,
                                    userTransmogData,
                                    masochist,
                                    drop
                                )
                                dropStatus.need = dropStatus.setHave < dropStatus.setNeed

                                dropStatus.setNote = getSetCurrencyCostsString(
                                    itemData,
                                    staticData,
                                    drop.appearanceIds,
                                    drop.costs,
                                    (appearanceId) => userTransmogData.userHas[appearanceId]
                                )
                                
                                break
                        }

                        dropStatus.skip = (
                            (farm.type === FarmType.Quest && !options.trackQuests) ||
                            (farm.type === FarmType.Vendor && !options.trackVendors) ||
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

                            const totalInc = dropStatus.setNeed || 1
                            const haveInc = dropStatus.setHave || 1
                            const special = drop.type === RewardType.SetSpecial

                            overallCounts.total += totalInc
                            if (categorySeen[drop.type][seenId] === undefined || special) {
                                categoryCounts.total += totalInc
                            }
                            if (mapSeen[drop.type][seenId] === undefined || special) {
                                mapCounts.total += totalInc
                                mapTypeCounts[fixedType].total += totalInc
                            }

                            if (!dropStatus.need) {
                                overallCounts.have += haveInc
                                if (categorySeen[drop.type][seenId] === undefined || special) {
                                    categoryCounts.have += haveInc
                                }
                                if (mapSeen[drop.type][seenId] === undefined || special) {
                                    mapCounts.have += haveInc
                                    mapTypeCounts[fixedType].have += haveInc
                                }
                            }

                            categorySeen[drop.type][seenId] = true
                            mapSeen[drop.type][seenId] = true
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
                                    case 'armor':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => classByArmorTypeString[drop.limit[1]]
                                                .indexOf(c.classId) >= 0
                                        )
                                        break

                                    case 'class':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => some(
                                                drop.limit.slice(1),
                                                (cl) => staticData.characterClassesBySlug[cl].id === c.classId
                                            )
                                        )
                                        break

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
                                    
                                    case 'profession':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => !!c.professions?.[professionSlugToId[drop.limit[1]]]
                                        )
                                        break
                                }
                            }

                            // Filter again for pre-req quests
                            if (drop.requiredQuestId > 0) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id]?.quests?.get(drop.requiredQuestId)
                                )
                            }

                            // Filter again for characters that haven't completed the quest
                            if (drop.type === RewardType.Quest) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id]?.quests?.get(drop.id) === undefined,
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
                                if (farm.type === FarmType.Quest) {
                                    if (every(
                                        farm.questIds,
                                        (q) =>
                                            userQuestData.characters[character.id]?.quests?.get(q) === undefined
                                    )
                                    ) {
                                        dropStatus.characterIds.push(character.id)
                                    }
                                    else {
                                        dropStatus.completedCharacterIds.push(character.id)
                                    }
                                }
                                else {
                                    if (
                                        expiredFunc(character.id) ||
                                        every(
                                            farm.questIds,
                                            (q) =>
                                                userQuestData.characters[character.id]?.dailyQuests?.get(q) === undefined &&
                                                character.lockouts?.[`${questToLockout[q] || 0}-0`] === undefined
                                        )
                                    ) {
                                        dropStatus.characterIds.push(character.id)
                                    }
                                    else {
                                        dropStatus.completedCharacterIds.push(character.id)
                                    }
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
