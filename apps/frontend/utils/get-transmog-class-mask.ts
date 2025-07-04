import { PlayableClassMask } from '@/enums/playable-class';
import { settingsState } from '@/shared/state/settings.svelte';

export default function getTransmogClassMask(): number {
    let classMask = 0;
    const settingsData = settingsState.value;

    if (settingsData.transmog.showMage) {
        classMask |= PlayableClassMask.Mage;
    }
    if (settingsData.transmog.showPriest) {
        classMask |= PlayableClassMask.Priest;
    }
    if (settingsData.transmog.showWarlock) {
        classMask |= PlayableClassMask.Warlock;
    }

    if (settingsData.transmog.showDemonHunter) {
        classMask |= PlayableClassMask.DemonHunter;
    }
    if (settingsData.transmog.showDruid) {
        classMask |= PlayableClassMask.Druid;
    }
    if (settingsData.transmog.showMonk) {
        classMask |= PlayableClassMask.Monk;
    }
    if (settingsData.transmog.showRogue) {
        classMask |= PlayableClassMask.Rogue;
    }

    if (settingsData.transmog.showEvoker) {
        classMask |= PlayableClassMask.Evoker;
    }
    if (settingsData.transmog.showHunter) {
        classMask |= PlayableClassMask.Hunter;
    }
    if (settingsData.transmog.showShaman) {
        classMask |= PlayableClassMask.Shaman;
    }

    if (settingsData.transmog.showDeathKnight) {
        classMask |= PlayableClassMask.DeathKnight;
    }
    if (settingsData.transmog.showPaladin) {
        classMask |= PlayableClassMask.Paladin;
    }
    if (settingsData.transmog.showWarrior) {
        classMask |= PlayableClassMask.Warrior;
    }

    return classMask;
}
