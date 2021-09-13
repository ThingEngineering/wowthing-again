import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
    faCrow,
    faDice,
    faHammer,
    faHorseHead,
    faTshirt
} from '@fortawesome/free-solid-svg-icons'


export const farmType: Record<string, IconDefinition> = {
    armor: faTshirt,
    mount: faHorseHead,
    pet: faCrow,
    toy: faDice,
    weapon: faHammer,
}
