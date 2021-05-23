import type {Account} from './account'
import type {Character} from './character'
import type {Dictionary} from './dictionary'

export class UserData {
    accounts?: Account[]
    characters: Character[]
    mounts: Dictionary<number>
    setCounts: Dictionary<Dictionary<UserDataSetCount>>
    toys: Dictionary<number>
}

class UserDataSetCount {
    have: number
    total: number
}
