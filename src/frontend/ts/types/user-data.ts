import type {Character} from './character'
import type {Dictionary} from './dictionary'

export class UserData {
    characters: Character[]
    mounts: Dictionary<number>
}
