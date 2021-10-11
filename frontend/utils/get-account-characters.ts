import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'

import type { Character, UserData } from '@/types'


export default function getAccountCharacters(userData: UserData, accountId: number): Character[] {
    return sortBy(
        filter(
            userData.characters,
            (character) => character.accountId === accountId
        ),
        (character) => character.name
    )
}
