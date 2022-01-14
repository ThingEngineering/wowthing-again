import every from 'lodash/every'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import { DateTime } from 'luxon'

import { classMap, classSlugMap } from '@/data/character-class'
import { covenantSlugMap } from '@/data/covenant'
import { factionMap } from '@/data/faction'
import { Settings, StaticData, UserCount, UserData, WritableFancyStore } from '@/types'
import { ZoneMapDataFarm } from '@/types/data'
import { FarmDropType, FarmResetType } from '@/types/enums'
import { getNextBiWeeklyReset, getNextDailyReset, getNextWeeklyReset } from '@/utils/get-next-reset'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { ZoneMapState } from '@/stores/local-storage/zone-map'
import type { DropStatus, FarmStatus } from '@/types'
import type { TransmogData, UserQuestData, UserTransmogData, ZoneMapData } from '@/types/data'


export class ZoneMapDataStore extends WritableFancyStore<ZoneMapData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-zone-map')
    }

    setup(
        settings: Settings,
        staticData: StaticData,
        transmogData: TransmogData,
        userQuestData: UserQuestData,
        userData: UserData,
        userTransmogData: UserTransmogData,
        zoneMapData: ZoneMapData,
        options: ZoneMapState,
    ): void {
        console.time('ZoneMapDataStore.setup')

        const classMask = getTransmogClassMask(settings)
        const now = DateTime.utc()

        const farmData: Record<string, FarmStatus[]> = {}
        const setCounts: Record<string, UserCount> = {}

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

        for (const maps of zoneMapData.sets) {
            const categorySeen: Record<number, Record<number, boolean>> = {}

            const categoryCounts = setCounts[maps[0].slug] = new UserCount()

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

                const mapSeen: Record<string, Record<number, boolean>> = {}

                const mapKey = `${maps[0].slug}--${map.slug}`
                const mapCounts = setCounts[mapKey] = new UserCount()

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
                        )
                    )
                )

                if (map.farmsRaw !== null) {
                    map.farms = map.farmsRaw.map((farmArray) => new ZoneMapDataFarm(...farmArray))
                    map.farmsRaw = null
                }

                const farms: FarmStatus[] = []
                for (const farm of map.farms) {
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

                        switch (drop.type) {
                            case FarmDropType.Mount:
                                if (!userData.mounts[staticData.spellToMount[drop.id]] &&
                                    !userData.addonMounts[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case FarmDropType.Pet:
                                if (!userData.pets[staticData.creatureToPet[drop.id]]) {
                                    dropStatus.need = true
                                }
                                break

                            case FarmDropType.Quest:
                                if (!every(userQuestData.characters, (c) => c.quests.get(drop.id) !== undefined)) {
                                    dropStatus.need = true
                                }
                                break

                            case FarmDropType.Toy:
                                if (!userData.toys[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case FarmDropType.Armor:
                            case FarmDropType.Cosmetic:
                            case FarmDropType.Weapon:
                                if (!userTransmogData.userHas[drop.id]) {
                                    dropStatus.need = true
                                }
                                break
                        }

                        dropStatus.skip = (
                            (drop.type === FarmDropType.Mount && !options.trackMounts) ||
                            (drop.type === FarmDropType.Pet && !options.trackPets) ||
                            (drop.type === FarmDropType.Quest && !options.trackQuests) ||
                            (drop.type === FarmDropType.Toy && !options.trackToys) ||
                            (transmogTypes.indexOf(drop.type) >= 0 && !options.trackTransmog)
                        )

                        if (!dropStatus.skip) {
                            if (categorySeen[drop.type] === undefined) {
                                categorySeen[drop.type] = {}
                            }
                            if (mapSeen[drop.type] === undefined) {
                                mapSeen[drop.type] = {}
                            }

                            overallCounts.total++
                            if (categorySeen[drop.type][drop.id] === undefined) {
                                categoryCounts.total++
                            }
                            if (mapSeen[drop.type][drop.id] === undefined) {
                                mapCounts.total++
                            }

                            if (!dropStatus.need) {
                                overallCounts.have++
                                if (categorySeen[drop.type][drop.id] === undefined) {
                                    categoryCounts.have++
                                }
                                if (mapSeen[drop.type][drop.id] === undefined) {
                                    mapCounts.have++
                                }
                            }

                            categorySeen[drop.type][drop.id] = true
                            mapSeen[drop.type][drop.id] = true
                        }

                        if (dropStatus.need && !dropStatus.skip) {
                            // Filter for class mask
                            if (drop.classMask > 0) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => (
                                        (drop.classMask & classMask) > 0 &&
                                        (drop.classMask & classMap[c.classId].mask) > 0
                                    )
                                )
                            }

                            if (drop.limit?.length > 0) {
                                switch (drop.limit[0]) {
                                    case 'class':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => some(drop.limit.slice(1), (cl) => classSlugMap[cl].id === c.classId)
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
                            if (drop.type === FarmDropType.Quest) {
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

                    const characterIds: Record<number, FarmDropType[]> = {}

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
                    farms.push(farmStatus)
                }

                farmData[mapKey] = farms
            } // category of categories.slice(1)
        } // categories of zoneMapData.sets

        this.update(state => {
            state.data.counts = setCounts
            state.data.farmStatus = farmData
            return state
        })

        console.timeEnd('ZoneMapDataStore.setup')
    }
}

export const zoneMapStore = new ZoneMapDataStore()


const transmogTypes: FarmDropType[] = [
    FarmDropType.Armor,
    FarmDropType.Cosmetic,
    FarmDropType.Weapon,
]
