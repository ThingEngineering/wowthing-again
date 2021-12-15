import every from 'lodash/every'
import filter from 'lodash/filter'
import some from 'lodash/some'

import { PlayableClassMask } from '@/types/enums'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalDataEncounterItemGroup, JournalDataEncounterItem, UserTransmogData } from '@/types/data'


export default function getFilteredItems(
    journalState: JournalState,
    settingsData: Settings,
    userTransmogData: UserTransmogData,
    group: JournalDataEncounterItemGroup
): JournalDataEncounterItem[] {
    let classMask = 0

    if (settingsData.transmog.showMage) {
        classMask |= PlayableClassMask.Mage
    }
    if (settingsData.transmog.showPriest) {
        classMask |= PlayableClassMask.Priest
    }
    if (settingsData.transmog.showWarlock) {
        classMask |= PlayableClassMask.Warlock
    }

    if (settingsData.transmog.showDemonHunter) {
        classMask |= PlayableClassMask.DemonHunter
    }
    if (settingsData.transmog.showDruid) {
        classMask |= PlayableClassMask.Druid
    }
    if (settingsData.transmog.showMonk) {
        classMask |= PlayableClassMask.Monk
    }
    if (settingsData.transmog.showRogue) {
        classMask |= PlayableClassMask.Rogue
    }

    if (settingsData.transmog.showHunter) {
        classMask |= PlayableClassMask.Hunter
    }
    if (settingsData.transmog.showShaman) {
        classMask |= PlayableClassMask.Shaman
    }

    if (settingsData.transmog.showDeathKnight) {
        classMask |= PlayableClassMask.DeathKnight
    }
    if (settingsData.transmog.showPaladin) {
        classMask |= PlayableClassMask.Paladin
    }
    if (settingsData.transmog.showWarrior) {
        classMask |= PlayableClassMask.Warrior
    }

    return filter(
        group.items,
        (item: JournalDataEncounterItem) => {
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

            // Timewalking
            if (!journalState.showTimewalking &&
                keep &&
                item.appearances.length === 1 &&
                item.appearances[0].difficulties.length === 1 &&
                [24, 33].indexOf(item.appearances[0].difficulties[0]) >= 0
            ) {
                keep = false
            }

            // Collected/uncollected toggles
            if (userTransmogData !== null && keep) {
                const allCollected = every(
                    item.appearances,
                    (appearance) => userTransmogData.userHas[appearance.appearanceId]
                )
                const anyCollected = some(
                    item.appearances,
                    (appearance) => userTransmogData.userHas[appearance.appearanceId]
                )
                if (
                    (!journalState.showUncollected && !anyCollected) ||
                    (!journalState.showCollected && allCollected)
                ) {
                    keep = false
                }
            }

            return keep
        }
    )
}
