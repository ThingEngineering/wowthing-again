import { Constants } from '@/data/constants'
import type { JournalState } from '@/stores/local-storage'
import {
    JournalDataEncounterItemAppearance,
    type JournalDataEncounterItem,
    type JournalDataEncounterItemGroup,
} from '@/types/data'


const weaponGroups = Object.fromEntries([
    'Bow',
    'Crossbow',
    'Dagger',
    'Fist',
    'Gun',
    '1h Axe',
    '1h Mace',
    '1h Sword',
    'Polearm',
    'Stave',
    '2h Axe',
    '2h Mace',
    '2h Sword',
    'Wand',
    'Warglaive',
    'Shield',
    'Off-hand',
].map((name) => [name, true]))

export default function getFilteredItems(
    journalState: JournalState,
    group: JournalDataEncounterItemGroup,
    classMask: number,
    instanceExpansion: number,
): JournalDataEncounterItem[] {
    const items: JournalDataEncounterItem[] = []

    for (const item of group.items) {
        let keep = true

        // Class mask is a quick check
        if (item.classMask > 0) {
            keep = (item.classMask & classMask) > 0
        }

        // Filter types
        if (keep && group.name === 'Cloth') {
            keep = journalState.showCloth
        }
        else if (keep && group.name === 'Leather') {
            keep = journalState.showLeather
        }
        else if (keep && group.name === 'Mail') {
            keep = journalState.showMail
        }
        else if (keep && group.name === 'Plate') {
            keep = journalState.showPlate
        }
        else if (keep && group.name.startsWith('Cloak')) {
            keep = journalState.showCloaks
        }
        else if (keep && weaponGroups[group.name] === true) {
            keep = journalState.showWeapons
        }

        if (!keep) {
            continue
        }

        // Appearances
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

            if (difficulties.length > 0) {
                appearances.push(new JournalDataEncounterItemAppearance(
                    appearance.appearanceId,
                    appearance.modifierId,
                    difficulties,
                ))
            }
        }

        if (appearances.length > 0) {
            const clonedItem = item.clone()
            clonedItem.appearances = appearances
            items.push(clonedItem)
        }
    }

    return items
}
