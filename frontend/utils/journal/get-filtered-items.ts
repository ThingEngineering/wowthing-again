import filter from 'lodash/filter'

import type { Settings } from '@/types'
import type { JournalDataEncounterItem } from '@/types/data'
import { classSlugMap } from '@/data/character-class'
import { weaponTypeToSubclass } from '@/data/item-class'
import { PlayableClassMask } from '@/types/enums'


export default function getFilteredItems(
    settingsData: Settings,
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

            if (item.id === 186404) {
                console.log(item, classMask, item.classMask & classMask)
            }

            // Class mask is a quick check
            if (item.classMask > 0) {
                keep = (item.classMask & classMask) > 0
            }

            return keep
        }
    )
}
