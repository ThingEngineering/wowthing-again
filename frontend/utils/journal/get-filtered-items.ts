import cloneDeep from 'lodash/cloneDeep'
import every from 'lodash/every'
import some from 'lodash/some'

import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalDataEncounterItemGroup, JournalDataEncounterItem, JournalDataEncounterItemAppearance, UserTransmogData } from '@/types/data'


export default function getFilteredItems(
    journalState: JournalState,
    settingsData: Settings,
    userTransmogData: UserTransmogData,
    group: JournalDataEncounterItemGroup
): JournalDataEncounterItem[] {
    const classMask = getTransmogClassMask(settingsData)
    const masochist = settingsData.transmog.completionistMode

    const items: JournalDataEncounterItem[] = []

    for (const origItem of group.items) {
        const item = cloneDeep(origItem)
        let keep = true

        // Class mask is a quick check
        if (item.classMask > 0) {
            keep = (item.classMask & classMask) > 0
        }

        // Armor types
        if (keep && group.name === 'Cloth') {
            keep = journalState.showCloth
        }
        if (keep && group.name === 'Leather') {
            keep = journalState.showLeather
        }
        if (keep && group.name === 'Mail') {
            keep = journalState.showMail
        }
        if (keep && group.name === 'Plate') {
            keep = journalState.showPlate
        }

        // Weapons
        if (keep && group.name === 'Weapons') {
            keep = journalState.showWeapons
        }

        // Appearances
        if (keep) {
            const appearances: JournalDataEncounterItemAppearance[] = []

            for (const appearance of item.appearances) {
                const difficulties: number[] = []

                for (const difficulty of appearance.difficulties) {
                    // LFR
                    if ([7, 17].indexOf(difficulty) >= 0) {
                        if (journalState.showLfr) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Normal
                    else if ([1, 3, 4, 9, 14].indexOf(difficulty) >= 0) {
                        if (journalState.showNormal) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Heroic
                    else if ([2, 5, 6, 15].indexOf(difficulty) >= 0) {
                        if (journalState.showHeroic) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Mythic
                    else if ([8, 16, 23].indexOf(difficulty) >= 0) {
                        if (journalState.showMythic) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Timewalking
                    else if ([24, 33].indexOf(difficulty) >= 0) {
                        if (journalState.showTimewalking) {
                            difficulties.push(difficulty)
                        }
                    }
                    else {
                        difficulties.push(difficulty)
                    }
                }

                appearance.difficulties = difficulties
                if (appearance.difficulties.length > 0) {
                    appearances.push(appearance)
                }
            }

            item.appearances = appearances
            if (appearances.length === 0) {
                keep = false
            }
        }

        // Collected/uncollected toggles
        if (userTransmogData !== null && keep) {
            const allCollected = every(
                item.appearances,
                (appearance) => masochist ?
                    userTransmogData.sourceHas[`${item.id}_${appearance.modifierId}`] :
                    userTransmogData.userHas[appearance.appearanceId]
            )
            const anyCollected = some(
                item.appearances,
                (appearance) => masochist ?
                    userTransmogData.sourceHas[`${item.id}_${appearance.modifierId}`] :
                    userTransmogData.userHas[appearance.appearanceId]
            )
            if (
                (!journalState.showUncollected && !anyCollected) ||
                (!journalState.showCollected && allCollected)
            ) {
                keep = false
            }
        }

        if (keep) {
            items.push(item)
        }
    }

    return items
}
