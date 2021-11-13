import keys from 'lodash/keys'
import some from 'lodash/some'
import {get} from 'svelte/store'

import { difficultyMap } from '@/data/difficulty'
import {Account, UserData, WritableFancyStore} from '@/types'
import initializeCharacter from '@/utils/initialize-character'


export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-user')
    }

    get useAccountTags(): boolean {
        return some(get(this).data.accounts, (a: Account) => !!a.tag)
    }

    initialize(userData: UserData): void {
        console.time('UserDataStore.initialize')

        userData.characterMap = {}
        const allLockouts: Record<string, boolean> = {}
        for (const character of userData.characters) {
            initializeCharacter(character)

            userData.characterMap[character.id] = character

            for (const key of keys(character.lockouts)) {
                allLockouts[key] = true
            }
        }

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

        console.timeEnd('UserDataStore.initialize')
    }
}

export const userStore = new UserDataStore()
