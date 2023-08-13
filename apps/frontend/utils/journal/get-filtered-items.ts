import { Constants } from '@/data/constants'
import type { JournalState } from '@/stores/local-storage'
import type {
    JournalDataEncounterItem,
    JournalDataEncounterItemAppearance,
    JournalDataEncounterItemGroup,
} from '@/types/data'


export default function getFilteredItems(
    journalState: JournalState,
    group: JournalDataEncounterItemGroup,
    classMask: number,
    instanceExpansion: number,
): JournalDataEncounterItem[] {
    const items: JournalDataEncounterItem[] = []

    for (const origItem of group.items) {
        const item = origItem.clone()
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
                    // Early skip for 10 player
                    if ((difficulty === 3 || difficulty === 5) && !journalState.showRaid10) {
                        continue
                    }
                    // Early skip for 25 player
                    if ((difficulty === 4 || difficulty === 6) && !journalState.showRaid25) {
                        continue
                    }

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
                    else if (difficulty === 5 || difficulty === 6 || difficulty === 15) {
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

        if (keep) {
            items.push(item)
        }
    }

    return items
}
