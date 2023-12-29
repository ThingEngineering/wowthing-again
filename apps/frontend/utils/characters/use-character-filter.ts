import every from 'lodash/every'
import some from 'lodash/some'
import { get } from 'svelte/store'

import { classByArmorType } from '@/data/character-class'
import { Constants } from '@/data/constants'
import { isGatheringProfession, isCraftingProfession, professionSlugToId } from '@/data/professions'
import { ArmorType } from '@/enums/armor-type'
import { Faction } from '@/enums/faction'
import { Role } from '@/enums/role'
import { staticStore } from '@/shared/stores/static'
import { parseBooleanQuery } from '@/shared/utils/boolean-parser'
import { LazyStore, userStore } from '@/stores'
import type { Character } from '@/types'


type FilterFunc = (char: Character) => boolean

const _cache: Record<string, string[][]> = {}

export function useCharacterFilter(
    lazyStore: LazyStore,
    filterFunc: FilterFunc,
    char: Character,
    filterString: string
): boolean {
    let result = true
    if (filterString?.length >= 2) {
        const staticData = get(staticStore)
        const userData = get(userStore)

        const filterLower = filterString.toLocaleLowerCase()
        const partArrays = (_cache[filterLower] ||= parseBooleanQuery(filterLower))
        // console.log(char.name, partArrays)

        const partCache: Record<string, boolean> = {}
        result = false
        if (partArrays.length > 0) {
            result = some(
                partArrays,
                (parts) => every(
                    parts,
                    (outerPart) => partCache[outerPart] ||= (function (part: string) {
                        if (char.name.toLocaleLowerCase().indexOf(part) >= 0) {
                            return true
                        }

                        // Level
                        const match = part.match(/^(level|lvl)(<|<=|=|>=|>)(\d+)$/)
                        if (match) {
                            const comparison = match[2].toString()
                            const value = parseInt(match[3])
                            if (comparison === '<') return char.level < value
                            else if (comparison === '<=') return char.level <= value
                            else if (comparison === '=') return char.level === value
                            else if (comparison === '>=') return char.level >= value
                            else if (comparison === '>') return char.level > value
                        }

                        // Account tag
                        const match2 = part.match(/^tag=(.*)$/)
                        if (match2) {
                            const tag = match2[1].toString()
                            return userData.accounts[char.accountId].tag.toLocaleLowerCase() == tag
                        }

                        // Realm slug
                        const match3 = part.match(/^realm=(.+)$/)
                        if (match3) {
                            const slug = match3[1].toString()
                            return char.realm.slug === slug
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

                        // Race slug
                        const raceSlug = part === 'pandaren' ? `pandaren${char.faction}` : part
                        if (staticData.characterRacesBySlug[raceSlug]) {
                            return char.raceId === staticData.characterRacesBySlug[raceSlug].id
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

                        // Armor type
                        if (part === 'cloth') {
                            return classByArmorType[ArmorType.Cloth].indexOf(char.classId) >= 0
                        }
                        else if (part === 'leather') {
                            return classByArmorType[ArmorType.Leather].indexOf(char.classId) >= 0
                        }
                        else if (part === 'mail') {
                            return classByArmorType[ArmorType.Mail].indexOf(char.classId) >= 0
                        }
                        else if (part === 'plate') {
                            return classByArmorType[ArmorType.Plate].indexOf(char.classId) >= 0
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
                            return char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] > 0
                        }

                        // Profession slug
                        const professionSlug = professionSlugMap[part] || part
                        if (professionSlugToId[professionSlug]) {
                            return !!char.professions?.[professionSlugToId[professionSlug]]
                        }

                        // Profession type
                        if (part.match(/^(craft|crafter|crafting)$/)) {
                            return some(
                                Object.keys(char.professions || {}),
                                (professionId) => isCraftingProfession[parseInt(professionId)]
                            )
                        }
                        if (part.match(/^(gather|gatherer|gathering)$/)) {
                            return some(
                                Object.keys(char.professions || {}),
                                (professionId) => isGatheringProfession[parseInt(professionId)]
                            )
                        }

                        // Available work orders
                        if (part === 'orders') {
                            return lazyStore.characters[char.id].professionWorkOrders.have > 0
                        }

                        // console.log('unmatched filter:', part)
                        return false
                    })(outerPart)
                )
            )
        }
    }

    return filterFunc ? filterFunc(char) && result : result
}

const professionSlugMap: Record<string, string> = {
    alc: 'alchemy',
    alch: 'alchemy',
    alchemist: 'alchemist',
    blacksmith: 'blacksmithing',
    cook: 'cooking',
    ench: 'enchanting',
    enchant: 'enchanting',
    eng: 'engineering',
    engi: 'engineering',
    engineer: 'engineering',
    engy: 'engineering',
    herb: 'herbalism',
    mine: 'mining',
    scribe: 'inscription',
    skin: 'skinning',
    smith: 'blacksmithing',
    tailor: 'tailoring',
}
