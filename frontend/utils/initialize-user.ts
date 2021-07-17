import keys from 'lodash/keys'

import initializeCharacter from './initialize-character'
import type { Character, Dictionary, UserData } from '@/types'
import {difficultyMap} from '@/data/difficulty'
import base64ToDictionary from '@/utils/base64-to-dictionary'
import {TypedArray} from '@/types/enums'

export default function initializeUser(userData: UserData): void {
    console.time('initializeUser')

    const allLockouts: Dictionary<boolean> = {}
    for (let i = 0; i < userData.characters.length; i++) {
        const character = userData.characters[i]
        initializeCharacter(character)

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
    }

    // unpack packed data
    userData.mounts = base64ToDictionary(TypedArray.Uint16, userData.mountsPacked)
    userData.toys = base64ToDictionary(TypedArray.Int32, userData.toysPacked)

    console.timeEnd('initializeUser')
}
