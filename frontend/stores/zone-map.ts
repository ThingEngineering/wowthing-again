import every from 'lodash/every'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import { DateTime } from 'luxon'

import { classMap, classSlugMap } from '@/data/character-class'
import { covenantSlugMap } from '@/data/covenant'
import { Settings, StaticData, UserData, UserDataSetCount, WritableFancyStore } from '@/types'
import { ArmorType, PrimaryStat, WeaponType } from '@/types/enums'
import { getNextDailyReset } from '@/utils/get-next-reset'
import type { ZoneMapState } from '@/stores/local-storage/zone-map'
import type { DropStatus, FarmStatus } from '@/types'
import type { TransmogData, UserCollectionData, UserQuestData, UserTransmogData, ZoneMapData } from '@/types/data'


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
        userCollectionData: UserCollectionData,
        userQuestData: UserQuestData,
        userData: UserData,
        userTransmogData: UserTransmogData,
        zoneMapData: ZoneMapData,
        options: ZoneMapState,
    ): void {
        console.time('ZoneMapDataStore.setup')

        const now = DateTime.utc()
        const farmData: Record<string, FarmStatus[]> = {}
        const setCounts: Record<string, UserDataSetCount> = {}

        const shownCharacters = filter(
            userData.characters,
            (c) => settings.characters.hiddenCharacters.indexOf(c.id) === -1
        )
        const overallCounts = setCounts['OVERALL'] = new UserDataSetCount(0, 0)
        const resetMap = fromPairs(toPairs(userQuestData.characters)
            .map(c => [
                c[0],
                getNextDailyReset(
                    c[1].scannedAt,
                    userData.characterMap[c[0]]?.realm?.region ?? 1,
                ),
            ])
        )

        for (const maps of zoneMapData.sets) {
            const categoryCounts = setCounts[maps[0].slug] = new UserDataSetCount(0, 0)

            const categorySeen: Record<string, Record<number, boolean>> = {}

            for (const map of maps.slice(1)) {
                if (map === null) {
                    continue
                }

                const mapSeen: Record<string, Record<number, boolean>> = {}

                const mapKey = `${maps[0].slug}--${map.slug}`
                const mapCounts = setCounts[mapKey] = new UserDataSetCount(0, 0)

                const eligibleCharacters = filter(
                    shownCharacters,
                    (c) => (
                        c.level >= map.minimumLevel &&
                        (
                            map.requiredQuestIds.length === 0 ||
                            some(
                                map.requiredQuestIds,
                                (q) => userQuestData.characters[c.id].quests.get(q)
                            )
                        )
                    )
                )

                const farms: FarmStatus[] = []
                for (const farm of map.farms) {
                    const farmStatus: FarmStatus = {
                        characters: [],
                        drops: [],
                        need: false,
                    }

                    let farmCharacters = eligibleCharacters
                    if (farm.minimumLevel > 0) {
                        farmCharacters = filter(
                            farmCharacters,
                            (c) => c.level >= farm.minimumLevel
                        )
                    }
                    if (farm.requiredQuestIds.length > 0) {
                        farmCharacters = filter(
                            farmCharacters,
                            (c) => some(
                                farm.requiredQuestIds,
                                (q) => userQuestData.characters[c.id].quests.get(q)
                            )
                        )
                    }

                    for (const drop of farm.drops) {
                        let dropCharacters = farmCharacters
                        const dropStatus: DropStatus = {
                            characterIds: [],
                            need: false,
                            skip: false,
                            validCharacters: false,
                        }

                        switch (drop.type) {
                            case 'mount':
                                if (!userCollectionData.mounts[staticData.spellToMount[drop.id]] &&
                                    !userCollectionData.addonMounts[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case 'pet':
                                if (!userCollectionData.pets[staticData.creatureToPet[drop.id]]) {
                                    dropStatus.need = true
                                }
                                break

                            case 'quest':
                                if (!every(userQuestData.characters, (c) => c.quests.get(drop.id) !== undefined)) {
                                    dropStatus.need = true
                                }
                                break

                            case 'toy':
                                if (!userCollectionData.toys[drop.id]) {
                                    dropStatus.need = true
                                }
                                break

                            case 'transmog':
                                if (!userTransmogData.transmog[drop.id]) {
                                    dropStatus.need = true
                                }
                                break
                        }

                        dropStatus.skip = (
                            (drop.type === 'mount' && !options.trackMounts) ||
                            (drop.type === 'pet' && !options.trackPets) ||
                            (drop.type === 'quest' && !options.trackQuests) ||
                            (drop.type === 'toy' && !options.trackToys) ||
                            (drop.type === 'transmog' && !options.trackTransmog)
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
                            // Filter for farm faction
                            if (farm.faction) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => c.faction === factionMap[farm.faction]
                                )
                            }

                            if (drop.limit?.length > 0) {
                                switch (drop.limit[0]) {
                                    case 'armor':
                                        if (drop.limit[1] !== 'cloak') {
                                            dropCharacters = filter(
                                                dropCharacters,
                                                (c) => classMap[c.classId].armorType === armorMap[drop.limit[1]]
                                            )
                                        }
                                        break;

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

                                    case 'weapon':
                                        dropCharacters = filter(
                                            dropCharacters,
                                            (c) => weaponValidForClass(c.classId, drop.limit.slice(1))
                                        )
                                        break
                                }
                            }

                            // Filter again for pre-req quests
                            if (drop.requiredQuestId !== undefined) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id].quests.get(drop.requiredQuestId)
                                )
                            }

                            // Filter again for characters that haven't completed the quest
                            if (drop.type === 'quest') {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => userQuestData.characters[c.id].quests.get(drop.id) === undefined,
                                )
                            }

                            dropStatus.validCharacters = dropCharacters.length > 0

                            // And finally, filter for characters that aren't locked
                            if (drop.questId) {
                                dropCharacters = filter(
                                    dropCharacters,
                                    (c) => resetMap[c.id] < now ||
                                        userQuestData.characters[c.id]?.dailyQuests?.get(drop.questId) === undefined
                                )
                            }

                            dropStatus.characterIds = filter(
                                dropCharacters,
                                (c) => resetMap[c.id] < now ||
                                    every(farm.questIds, (q) => userQuestData.characters[c.id]?.dailyQuests?.get(q) === undefined)
                            ).map(c => c.id)

                            // We don't really need it if no characters are on the list
                            // - ok we kinda do so we can see unfinished things
                            //if (dropStatus.characterIds.length === 0) {
                            //    dropStatus.need = false
                            //}
                        }

                        farmStatus.drops.push(dropStatus)
                    } // for drop of farm.drops

                    farmStatus.need = some(farmStatus.drops, (d) => d.need && !d.skip)

                    const characterIds: Record<number, string[]> = {}

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


const armorMap: Record<string, ArmorType> = {
    cloth: ArmorType.Cloth,
    leather: ArmorType.Leather,
    mail: ArmorType.Mail,
    plate: ArmorType.Plate,
}

const factionMap: Record<string, number> = {
    alliance: 0,
    horde: 1,
}

const statMap: Record<string, PrimaryStat> = {
    'agi': PrimaryStat.Agility,
    'int': PrimaryStat.Intellect,
    'str': PrimaryStat.Strength,
}

const weaponMap: Record<string, WeaponType> = {
    '1h-axe': WeaponType.OneHandedAxe,
    '1h-mace': WeaponType.OneHandedMace,
    '1h-sword': WeaponType.OneHandedSword,
    '2h-axe': WeaponType.TwoHandedAxe,
    '2h-mace': WeaponType.TwoHandedMace,
    '2h-sword': WeaponType.TwoHandedSword,
    'bow': WeaponType.Bow,
    'crossbow': WeaponType.Crossbow,
    'dagger': WeaponType.Dagger,
    'fist': WeaponType.Fist,
    'gun': WeaponType.Gun,
    'polearm': WeaponType.Polearm,
    'shield': WeaponType.Shield,
    'stave': WeaponType.Stave,
    'wand': WeaponType.Wand,
    'warglaive': WeaponType.Warglaive,
}

const weaponValidCache: Record<string, boolean> = {}
function weaponValidForClass(classId: number, limit: string[]): boolean {
    const key = `${classId}--${limit.join('--')}`
    if (weaponValidCache[key] === undefined) {
        weaponValidCache[key] = getWeaponValidity(classId, limit)
    }
    return weaponValidCache[key]
}

function getWeaponValidity(classId: number, limit: string[]): boolean {
    const weaponType = weaponMap[limit[0]]
    if (!weaponType) {
        return true
    }

    const cls = classMap[classId]
    if (cls.weaponTypes.indexOf(weaponType) >= 0) {
        if (limit.length > 1) {
            for (const mainStat of limit.slice(1)) {
                if (cls.primaryStats.indexOf(statMap[mainStat]) >= 0) {
                    return true
                }
            }
        }
        else {
            return true
        }
    }

    return false
}
