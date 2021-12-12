import every from 'lodash/every'
import filter from 'lodash/filter'
import some from 'lodash/some'

import { PlayableClassMask } from '@/types/enums'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalDataEncounterItem, UserTransmogData } from '@/types/data'
import { ArmorSubclass, ItemClass } from '@/types/enums'


export default function getFilteredItems(
    journalState: JournalState,
    settingsData: Settings,
    userTransmogData: UserTransmogData,
    items: JournalDataEncounterItem[]
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
        items,
        (item: JournalDataEncounterItem) => {
            let keep = true

            // Class mask is a quick check
            if (item.classMask > 0) {
                keep = (item.classMask & classMask) > 0
            }

            // Weapons
            if (keep && item.classId === ItemClass.Weapon) {
                keep = journalState.showWeapons
            }

            // Armor types
            if (keep && item.classId === ItemClass.Armor) {
                if (item.subclassId === ArmorSubclass.Cloth) {
                    keep = journalState.showCloth
                }
                else if (item.subclassId === ArmorSubclass.Leather) {
                    keep = journalState.showLeather
                }
                else if (item.subclassId === ArmorSubclass.Mail) {
                    keep = journalState.showMail
                }
                else if (item.subclassId === ArmorSubclass.Plate) {
                    keep = journalState.showPlate
                }
                else if (item.subclassId === ArmorSubclass.Shield) {
                    keep = journalState.showWeapons
                }
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
