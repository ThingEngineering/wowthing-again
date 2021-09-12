import { faDice, faHorseHead, faTshirt } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'


export const farmType: Record<string, IconDefinition> = {
    mount: faHorseHead,
    toy: faDice,
    transmog: faTshirt,
}
