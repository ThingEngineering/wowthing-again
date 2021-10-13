import every from 'lodash/every'
import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import {DateTime} from 'luxon'

import {classMap} from '@/data/character-class'
import {covenantSlugMap} from '@/data/covenant'
import type {FarmState} from '@/stores/local-storage/farm'
import { ArmorType, PrimaryStat, WeaponType } from '@/types/enums'
import {getNextDailyReset} from '@/utils/get-next-reset'
import type {Character, StaticData, UserData} from '@/types'
import type {FarmDataCategory, UserCollectionData, UserQuestData, UserTransmogData} from '@/types/data'


function weaponValidForClass(classId: number, limit: string[]): boolean {
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

export default function getFarmStatus(
    staticData: StaticData,
    userData: UserData,
    userCollectionData: UserCollectionData,
    userQuestData: UserQuestData,
    userTransmogData: UserTransmogData,
    timeStore: DateTime,
    category: FarmDataCategory,
    options: FarmState,
): FarmStatus[] {
    //console.time('getFarmStatus')

    const minLevelCharacters = filter(
        userData.characters,
        (c) => c.level >= category.minimumLevel
    )

    const now = DateTime.utc()
    const resetMap = fromPairs(toPairs(userQuestData.characters)
        .map(c => [
            c[0],
            getNextDailyReset(
                c[1].scannedAt,
                userData.characterMap[c[0]]?.realm?.region ?? 1,
            ),
        ])
    )

    const farms: FarmStatus[] = []
    for (const farm of category.farms) {
        const farmStatus: FarmStatus = {
            characters: [],
            need: false,
            drops: [],
        }

        for (const drop of farm.drops) {
            const dropStatus: DropStatus = {
                need: false,
                skip: false,
                characterIds: [],
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

            if (dropStatus.need && !dropStatus.skip) {
                let characters: Character[]

                if (drop.limit?.length > 0) {
                    switch (drop.limit[0]) {
                        case 'armor':
                            characters = filter(
                                minLevelCharacters,
                                (c) => classMap[c.classId].armorType === armorMap[drop.limit[1]]
                            )
                            break;

                        case 'covenant':
                            characters = filter(
                                minLevelCharacters,
                                (c) => c.shadowlands?.covenantId === covenantSlugMap[drop.limit[1]].id
                            )
                            break

                        case 'weapon':
                            characters = filter(
                                minLevelCharacters,
                                (c) => weaponValidForClass(c.classId, drop.limit.slice(1))
                            )
                            break
                    }
                }
                else {
                    characters = minLevelCharacters
                }

                // Filter again for characters that haven't completed the quest
                if (drop.type === 'quest') {
                    characters = filter(
                        characters,
                        (c) => userQuestData.characters[c.id].quests.get(drop.id) === undefined,
                    )
                }

                dropStatus.characterIds = filter(
                    characters,
                    (c) => resetMap[c.id] < now ||
                        every(farm.questIds, (q) => userQuestData.characters[c.id]?.dailyQuests?.get(q) === undefined)
                ).map(c => c.id)
            }

            farmStatus.drops.push(dropStatus)
        }

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

    //console.timeEnd('getFarmStatus')

    return farms
}


export interface FarmStatus {
    characters: CharacterStatus[]
    need: boolean
    drops: DropStatus[]
}

export interface DropStatus {
    need: boolean
    skip: boolean
    characterIds: number[]
}

export interface CharacterStatus {
    id: number
    types: string[]
}

const armorMap: Record<string, ArmorType> = {
    cloth: ArmorType.Cloth,
    leather: ArmorType.Leather,
    mail: ArmorType.Mail,
    plate: ArmorType.Plate,
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
