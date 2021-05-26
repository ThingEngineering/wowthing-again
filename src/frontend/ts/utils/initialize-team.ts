import initializeCharacter from './initialize-character'
import type {TeamData} from '@/types'

export default function initializeTeam(teamData: TeamData) {
    console.time('initializeTeam')
    for (let i = 0; i < teamData.characters.length; i++) {
        const character = teamData.characters[i].character
        initializeCharacter(character)
    }
    console.timeEnd('initializeTeam')
}
