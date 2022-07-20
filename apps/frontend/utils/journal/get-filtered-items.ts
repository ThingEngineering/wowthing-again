import cloneDeep from 'lodash/cloneDeep'

import type { JournalState } from '@/stores/local-storage'
import type { JournalDataEncounterItemGroup, JournalDataEncounterItem, JournalDataEncounterItemAppearance, UserTransmogData } from '@/types/data'
import { Constants } from '@/data/constants'


export default function getFilteredItems(
    journalState: JournalState,
    userTransmogData: UserTransmogData,
    group: JournalDataEncounterItemGroup,
    classMask: number,
    instanceExpansion: number,
    masochist: boolean
): JournalDataEncounterItem[] {
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
                    if (difficulty === 7 || difficulty === 17) {
                        if (journalState.showRaidLfr) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Normal
                    else if (difficulty === 1) {
                        if (journalState.showDungeonNormal) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if (difficulty === 3 || difficulty === 4 || difficulty === 9 || difficulty === 14) {
                        if (journalState.showRaidNormal) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Heroic
                    else if (difficulty === 2) {
                        if (journalState.showDungeonHeroic) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if (difficulty === 5 || difficulty ===6 || difficulty === 15) {
                        if (journalState.showRaidHeroic) {
                            difficulties.push(difficulty)
                        }
                    }
                    // Mythic
                    else if (difficulty === 8 || difficulty === 23) {
                        if (journalState.showDungeonMythic) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if (difficulty === 16) {
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
                    else if (difficulty === 24) {
                        if (journalState.showDungeonTimewalking) {
                            difficulties.push(difficulty)
                        }
                    }
                    else if (difficulty === 33) {
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
            let allCollected = true
            let anyCollected = false
            for (const appearance of item.appearances) {
                let has = false
                if (masochist) {
                    has = userTransmogData.sourceHas[`${item.id}_${appearance.modifierId}`]
                }
                else {
                    has = userTransmogData.userHas[appearance.appearanceId]
                }
                
                if (has) {
                    anyCollected = true
                }
                else {
                    allCollected = false
                }
            }

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
