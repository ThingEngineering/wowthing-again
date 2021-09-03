import keys from 'lodash/keys'
import some from 'lodash/some'
import {get} from 'svelte/store'

import { difficultyMap } from '@/data/difficulty'
import {Account, Dictionary, UserData, WritableFancyStore} from '@/types'
import { TypedArray } from '@/types/enums'
import base64ToDictionary from '@/utils/base64-to-dictionary'
import initializeCharacter from '@/utils/initialize-character'


export class UserDataStore extends WritableFancyStore<UserData> {
    get dataUrl(): string {
        return document.getElementById('app')?.getAttribute('data-user')
    }

    get useAccountTags(): boolean {
        return some(get(this).data.accounts, (a: Account) => !!a.tag)
    }

    initialize(userData: UserData): void {
        console.time('initialize UserDataStore')

        userData.characterMap = {}
        const allLockouts: Dictionary<boolean> = {}
        for (let i = 0; i < userData.characters.length; i++) {
            const character = userData.characters[i]
            initializeCharacter(character)

            userData.characterMap[character.id] = character

            for (const key of keys(character.lockouts)) {
                allLockouts[key] = true
            }
        }

        userData.allLockouts = []
        for (const instanceDifficulty of keys(allLockouts)) {
            const [instanceId, difficultyId] = instanceDifficulty.split('-')
            const difficulty = difficultyMap[difficultyId]

            if (difficulty && instanceId) {
                userData.allLockouts.push({
                    difficulty,
                    instanceId: parseInt(instanceId),
                    key: instanceDifficulty,
                })
            }
            else {
                console.log({instanceId, difficultyId, difficulty})
            }
        }

        // unpack packed data
        userData.mounts = base64ToDictionary(TypedArray.Uint16, userData.mountsPacked)
        userData.toys = base64ToDictionary(TypedArray.Int32, userData.toysPacked)

        userData.mountsPacked = null
        userData.toysPacked = null

        console.timeEnd('initialize UserDataStore')

    }
}

export const userStore = new UserDataStore()
