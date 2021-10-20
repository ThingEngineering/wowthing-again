import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
    faArchive,
    faCrow,
    faDice,
    faHammer,
    faHatWizard,
    faHorseHead,
    faPuzzlePiece,
    faQuestion,
    faSkull,
    faTshirt
} from '@fortawesome/free-solid-svg-icons'


export const farmType: Record<string, IconDefinition> = {
    chest: faArchive,
    kill: faSkull,
    killBig: faSkull,
    puzzle: faPuzzlePiece,
}

export const dropType: Record<string, IconDefinition> = {
    armor: faTshirt,
    mount: faHorseHead,
    pet: faCrow,
    quest: faQuestion,
    toy: faDice,
    transmog: faHatWizard,
    weapon: faHammer,
}
