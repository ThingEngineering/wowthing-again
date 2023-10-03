import { Language } from '@/enums/language'


export function getWowheadDomain(language: Language): string {
    switch (language) {
        case Language.deDE:
            return 'de'
        case Language.enUS:
            return 'www'
        case Language.esES:
            return 'es'
        case Language.esMX:
            return 'es'
        case Language.frFR:
            return 'fr'
        case Language.itIT:
            return 'it'
        case Language.ruRU:
            return 'ru'
        case Language.ptBR:
            return 'pt'
    }
}
