import filter from 'lodash/filter'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import {DateTime} from 'luxon'
import {get} from 'svelte/store'

import {classMap} from '@/data/character-class'
import {covenantSlugMap} from '@/data/covenant'
import {staticStore, userPetStore, userQuestStore, userStore, userTransmogStore} from '@/stores'
import {ArmorType, WeaponType} from '@/types/enums'
import getNextDailyReset from '@/utils/get-next-daily-reset'
import type {Character} from '@/types'
import type {FarmDataCategory} from '@/types/data'


export default function getFarmStatus(category: FarmDataCategory, timeStore: DateTime): FarmStatus[] {
    //console.time('getFarmStatus')

    const staticData = get(staticStore).data
    const userData = get(userStore).data
    const userPetData = get(userPetStore).data
    const userQuestData = get(userQuestStore).data
    const userTransmogData = get(userTransmogStore).data

    const minLevelCharacters = filter(
        userData.characters,
        (c) => c.level >= category.minimumLevel
    )

    const now = DateTime.utc()
    const resetMap = fromPairs(toPairs(userQuestData.characters)
        .map(c => [
            c[0],
            getNextDailyReset(
                c[1].scanTime,
                staticData.realms[userData.characterMap[c[0]].realmId].region,
            )
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
                characterIds: [],
            }

            switch (drop.type) {
                case 'mount':
                    if (!userData.mounts[staticData.spellToMount[drop.id]]) {
                        dropStatus.need = true
                    }
                    break

                case 'pet':
                    if (!userPetData.pets[drop.id]) {
                        dropStatus.need = true
                    }
                    break

                case 'toy':
                    if (!userData.toys[drop.id]) {
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

            if (dropStatus.need) {
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

        farmStatus.need = some(farmStatus.drops, (d) => d.need)

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

interface DropStatus {
    need: boolean
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
