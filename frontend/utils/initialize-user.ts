import initializeCharacter from './initialize-character'
import type {Character, UserData} from '@/types'

export default function initializeUser(userData: UserData): void {
    console.time('initializeUser')
    for (let i = 0; i < userData.characters.length; i++) {
        const character = userData.characters[i]
        initializeCharacter(character)
    }

    // TODO hook up saved settings
    const sortKeys = [
        'enabled',
        //'faction',
        'level',
        'name',
    ]

    userData.characters.sort((a, b) => {
        for (let i = 0; i < sortKeys.length; i++) {
            const result = nastySort(userData, sortKeys[i], a, b)
            if (result !== 0) {
                return result
            }
        }

        return 0
    })

    console.timeEnd('initializeUser')
}

function nastySort(userData: UserData, key: string, a: Character, b: Character): number {
    // Account enabled
    if (key === 'enabled') {
        const aEnabled = a.accountId === undefined || userData.accounts?.[a.accountId].enabled
        const bEnabled = b.accountId === undefined || userData.accounts?.[b.accountId].enabled

        if (aEnabled && !bEnabled) { return -1 }
        else if (!aEnabled && bEnabled) { return 1 }
    }
    // Character faction
    else if (key === 'faction') {
        if (a.faction < b.faction) { return -1}
        else if (a.faction > b.faction) { return 1}
    }
    // Character level, reverse order
    else if (key === 'level') {
        if (a.level > b.level) { return -1 }
        else if (a.level < b.level) { return 1 }
    }
    // Character name
    else if (key === 'name') {
        if (a.name < b.name) { return -1 }
        else if (a.name > b.name) { return 1 }
    }

    return 0
}
