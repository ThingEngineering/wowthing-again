import every from 'lodash/every'
import filter from 'lodash/filter'
import some from 'lodash/some'

import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalDataEncounterItemGroup, JournalDataEncounterItem, UserTransmogData } from '@/types/data'


export default function getFilteredItems(
    journalState: JournalState,
    settingsData: Settings,
    userTransmogData: UserTransmogData,
    group: JournalDataEncounterItemGroup
): JournalDataEncounterItem[] {
    const classMask = getTransmogClassMask(settingsData)
    const masochist = settingsData.transmog.completionistMode

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

            return keep
        }
    )
}
