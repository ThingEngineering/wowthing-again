import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import {DateTime} from 'luxon'

import {classMap} from '@/data/character-class'
import {covenantSlugMap} from '@/data/covenant'
import {ArmorType, WeaponType} from '@/types/enums'
import {getNextDailyReset} from '@/utils/get-next-reset'
import type {Character, StaticData, UserData} from '@/types'
import type {
    FarmDataCategory,
    FarmDataDrop,
    UserCollectionData,
    UserQuestData,
    UserTransmogData
} from '@/types/data'


export default function getFarmStatus(
    staticData: StaticData,
    userData: UserData,
    userCollectionData: UserCollectionData,
    userQuestData: UserQuestData,
    userTransmogData: UserTransmogData,
    timeStore: DateTime,
    category: FarmDataCategory,
    options: GetFarmStatusOptions,
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
                userData.characterMap[c[0]].realm.region,
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
                    if (!userCollectionData.pets[drop.id]) {
                        dropStatus.need = true
                    }
                    break

                case 'toy':
                    if (!userCollectionData.toys[drop.id]) {
                        dropStatus.need = true
                    }
                    break

                case 'armor':
                case 'weapon':
                    if (!userTransmogData.transmog[drop.id]) {
                        dropStatus.need = true
                    }
                    break
            }

            dropStatus.skip = (
                (drop.type === 'mount' && !options.trackMounts) ||
                (drop.type === 'pet' && !options.trackPets) ||
                (drop.type === 'toy' && !options.trackToys) ||
                ((drop.type === 'armor' || drop.type === 'weapon') && !options.trackTransmog)
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
                                (c) => classMap[c.classId].weaponTypes.indexOf(weaponMap[drop.limit[1]]) >= 0
                            )
                            break
                    }
                }
                else {
                    characters = minLevelCharacters
                }

                dropStatus.characterIds = filter(
                    characters,
                    (c) => resetMap[c.id] < now ||
                        userQuestData.characters[c.id].dailyQuests.get(farm.questId) === undefined,
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


interface GetFarmStatusOptions {
    trackMounts: boolean
    trackPets: boolean
    trackToys: boolean
    trackTransmog: boolean
}

export interface FarmStatus {
    characters: CharacterStatus[]
    need: boolean
    drops: DropStatus[]
}

interface DropStatus {
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

const weaponMap: Record<string, WeaponType> = {
    '1h-axe': WeaponType.OneHandedAxe,
    dagger: WeaponType.Dagger,
    polearm: WeaponType.Polearm,
    stave: WeaponType.Stave,
}
