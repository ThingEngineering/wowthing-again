import every from 'lodash/every'
import { get } from 'svelte/store'

import { Constants } from '@/data/constants'
import { professionSlugToId } from '@/data/professions'
import { Faction, Role } from '@/enums'
import { staticStore } from '@/stores'
import type { Character } from '@/types'


type FilterFunc = (char: Character) => boolean

export function useCharacterFilter(
    filterFunc: FilterFunc,
    char: Character,
    filterString: string
): boolean {
    if (filterString?.length >= 2) {
        const staticData = get(staticStore)

        const parts = filterString.toLocaleLowerCase().split(/\s+/)
        if (parts.length > 0) {
            return every(
                parts,
                (part) => {
                    if (char.name.toLocaleLowerCase().indexOf(part) >= 0) {
                        return true
                    }

                    // Faction
                    if (part === 'alliance') {
                        return char.faction === Faction.Alliance
                    }
                    else if (part === 'horde') {
                        return char.faction === Faction.Horde
                    }
                    else if (part === 'netural') {
                        return char.faction === Faction.Neutral
                    }

                    // Class slug
                    let classSlug = part
                    if (classSlug === 'dh') {
                        classSlug = 'demon-hunter'
                    }
                    else if (classSlug === 'dk') {
                        classSlug = 'death-knight'
                    }
                    if (staticData.characterClassesBySlug[classSlug]) {
                        return char.classId === staticData.characterClassesBySlug[classSlug].id
                    }

                    // Race slug
                    const raceSlug = part === 'pandaren' ? `pandaren${char.faction}` : part
                    if (staticData.characterRacesBySlug[raceSlug]) {
                        return char.raceId === staticData.characterRacesBySlug[raceSlug].id
                    }

                    // Specializations
                    if (part === 'tank') {
                        const spec = staticData.characterSpecializations[char.activeSpecId]
                        return spec?.role === Role.Tank
                    }
                    else if (part === 'heal' || part === 'healer' || part === 'heals') {
                        const spec = staticData.characterSpecializations[char.activeSpecId]
                        return spec?.role === Role.Healer
                    }
                    else if (part === 'dps' || part === 'deeps') {
                        const spec = staticData.characterSpecializations[char.activeSpecId]
                        return spec?.role === Role.MeleeDps || spec?.role === Role.RangedDps
                    }

                    // Mythic+ score
                    if (part === 'm+') {
                        console.log(char)
                        return char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] > 0
                    }

                    // Profession slug
                    if (professionSlugToId[part]) {
                        return !!char.professions?.[professionSlugToId[part]]
                    }

                    // console.log('unmatched filter:', part)
                    return false
                }
            )
        }
    }

    return filterFunc(char)
}
