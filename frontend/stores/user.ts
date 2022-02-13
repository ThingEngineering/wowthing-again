import keys from 'lodash/keys'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import { get } from 'svelte/store'

import { difficultyMap } from '@/data/difficulty'
import { Account, CharacterCurrency, UserCount, UserData, UserDataPet, WritableFancyStore } from '@/types'
import { TypedArray } from '@/types/enums'
import base64ToRecord from '@/utils/base64-to-record'
import initializeCharacter from '@/utils/initialize-character'
import type { StaticData, StaticDataSetCategory } from '@/types/data/static'


export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-user')
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

        // Initialize characters
        userData.characterMap = {}
        const allLockouts: Record<string, boolean> = {}
        for (const character of userData.characters) {
            initializeCharacter(character)

            userData.characterMap[character.id] = character

            for (const key of keys(character.lockouts)) {
                allLockouts[key] = true
            }

            if (character.currenciesRaw !== null) {
                character.currencies = {}
                for (const rawCurrency of character.currenciesRaw) {
                    const obj = new CharacterCurrency(...rawCurrency)
                    character.currencies[obj.id] = obj
                }
                character.currenciesRaw = null
            }

            if (character.specializationsRaw !== null) {
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

        // console.timeEnd('UserDataStore.initialize')
    }

    setup(staticData: StaticData, userData: UserData): void {
        // console.time('UserDataStore.setup')

        const hasMountSpell: Record<number, boolean> = {}
        for (const mountId in userData.hasMount) {
            const mount = staticData.mounts[mountId]
            if (mount) {
                hasMountSpell[mount.spellId] = true
            }
            else {
                console.warn('Missing mount data for', mountId)
            }
        }

        const hasPetCreature: Record<number, boolean> = {}
        for (const petId in userData.hasPet) {
            const pet = staticData.pets[petId]
            if (pet) {
                hasPetCreature[pet.creatureId] = true
            }
            else {
                console.warn('Missing pet data for', petId)
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
            staticData.mountSets,
            userData.hasMount,
            (spellId) => staticData.mountsBySpellId[spellId].id
        )
        UserDataStore.doSetCounts(
            setCounts['pets'],
            staticData.petSets,
            userData.hasPet,
            (creatureId) => staticData.petsByCreatureId[creatureId].id
        )
        UserDataStore.doSetCounts(
            setCounts['toys'],
            staticData.toySets,
            userData.hasToy
        )

        this.update(state => {
            state.data.hasMountSpell = hasMountSpell
            state.data.hasPetCreature = hasPetCreature
            state.data.setCounts = setCounts
            return state
        })

        // console.timeEnd('UserDataStore.setup')
    }

    private static doSetCounts(
        setCounts: Record<string, UserCount>,
        categories: StaticDataSetCategory[][],
        userHas: Record<number, boolean>,
        mapFunc?: (origId: number) => number,
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
                        const hasThing = some(things, (t) => userHas[mapFunc?.(t) ?? t])
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

    /*public knowsMount(spellId: number) {
        return this.get().data.
    }*/
}

export const userStore = new UserDataStore()
