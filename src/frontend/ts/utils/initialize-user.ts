import initializeCharacter from './initialize-character'
import type {UserData} from '../types'

export default function initializeUser(userData: UserData) {
    console.time('initializeUser')
    for (let i = 0; i < userData.characters.length; i++) {
        const character = userData.characters[i]
        initializeCharacter(character)
    }
    console.timeEnd('initializeUser')
}
