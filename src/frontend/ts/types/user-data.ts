import type {Account} from './account'
import type {Character} from './character'
import type {Dictionary} from './dictionary'

export interface UserData {
    accounts?: Account[]
    characters: Character[]
    mounts: Dictionary<number>
    setCounts: Dictionary<Dictionary<UserDataSetCount>>
    toys: Dictionary<number>
}

interface UserDataSetCount {
    have: number
    total: number
}
