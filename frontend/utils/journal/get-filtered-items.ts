import cloneDeep from 'lodash/cloneDeep'
import every from 'lodash/every'
import some from 'lodash/some'

import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalDataEncounterItemGroup, JournalDataEncounterItem, JournalDataEncounterItemAppearance, UserTransmogData } from '@/types/data'
import { Constants } from '@/data/constants'


export default function getFilteredItems(
    journalState: JournalState,
    settingsData: Settings,
    userTransmogData: UserTransmogData,
    instanceExpansion: number,
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

        // Filter types
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

        if (keep && group.name === 'Cloaks') {
            keep = journalState.showCloaks
        }

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
                        if (journalState.showRaidLfr) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Normal
                    else if ([1].indexOf(difficulty) >= 0) {
                        if (journalState.showDungeonNormal) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if ([3, 4, 9, 14].indexOf(difficulty) >= 0) {
                        if (journalState.showRaidNormal) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Heroic
                    else if ([2].indexOf(difficulty) >= 0) {
                        if (journalState.showDungeonHeroic) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if ([5, 6, 15].indexOf(difficulty) >= 0) {
                        if (journalState.showRaidHeroic) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Mythic
                    else if ([8, 23].indexOf(difficulty) >= 0) {
                        if (journalState.showDungeonMythic) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if ([16].indexOf(difficulty) >= 0) {
                        if (instanceExpansion === Constants.expansion) {
                            if (journalState.showRaidMythic) {
                                difficulties.push(difficulty)
                            }
                        }
                        else if (journalState.showRaidMythicOld) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Timewalking
                    else if ([24].indexOf(difficulty) >= 0) {
                        if (journalState.showDungeonTimewalking) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if ([33].indexOf(difficulty) >= 0) {
                        if (journalState.showRaidTimewalking) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Leftovers
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
