import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
    faCrow,
    faDice,
    faHammer,
    faHatWizard,
    faHorseHead,
    faQuestion,
    faTshirt
} from '@fortawesome/free-solid-svg-icons'


export const farmType: Record<string, IconDefinition> = {
    armor: faTshirt,
    mount: faHorseHead,
    pet: faCrow,
    quest: faQuestion,
    toy: faDice,
    transmog: faHatWizard,
    weapon: faHammer,
}
