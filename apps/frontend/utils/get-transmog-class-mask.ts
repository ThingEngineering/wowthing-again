import { PlayableClassMask } from '@/types/enums'
import type { Settings } from '@/types'


export default function getTransmogClassMask(settingsData: Settings): number {
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

    return classMask
}
