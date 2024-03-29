import { get } from 'svelte/store'

import { staticStore } from '@/shared/stores/static'
import type { Character, CharacterProfession } from '@/types'
import type { StaticDataProfession } from '@/shared/stores/static/types'


export type ProfessionData = [StaticDataProfession, CharacterProfession, boolean]

export function getCharacterProfessions(
    character: Character,
    professionType: number
): ProfessionData[] {
    const staticData = get(staticStore)
    const professions: ProfessionData[] = []

    for (const professionId in staticData.professions) {
        const profession = staticData.professions[professionId]
        if (profession?.type === professionType) {
            if (profession.subProfessions.length > 0) {
                let found = false
                for (let i = profession.subProfessions.length; i > 0; i--) {
                    const subProfession = profession.subProfessions[i - 1]
                    const characterSubProfession = character.professions?.[profession.id]?.[subProfession.id]
                    if (characterSubProfession) {
                        professions.push([
                            profession,
                            characterSubProfession,
                            i === profession.subProfessions.length
                        ])
                        found = true
                        break
                    }
                }

                if (!found && professionType === 1) {
                    professions.push([
                        profession,
                        null,
                        true
                    ])
                }
            }
            else {
                const characterProfession = character.professions?.[profession.id]?.[profession.id]
                professions.push([
                    profession,
                    characterProfession || null,
                    true
                ])
            }
        }
    }

    professions.sort((a, b) => a[0].name.localeCompare(b[0].name))
    return professions
}
