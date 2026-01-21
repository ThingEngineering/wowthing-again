import { PlayableClassMask } from '@/enums/playable-class';
import { settingsState } from '@/shared/state/settings.svelte';

export default function getTransmogClassMask(): number {
    let classMask = 0;
    const transmogSettings = settingsState.value.transmog;

    if (transmogSettings.showMage) {
        classMask |= PlayableClassMask.Mage;
    }
    if (transmogSettings.showPriest) {
        classMask |= PlayableClassMask.Priest;
    }
    if (transmogSettings.showWarlock) {
        classMask |= PlayableClassMask.Warlock;
    }

    if (transmogSettings.showDemonHunter) {
        classMask |= PlayableClassMask.DemonHunter;
    }
    if (transmogSettings.showDruid) {
        classMask |= PlayableClassMask.Druid;
    }
    if (transmogSettings.showMonk) {
        classMask |= PlayableClassMask.Monk;
    }
    if (transmogSettings.showRogue) {
        classMask |= PlayableClassMask.Rogue;
    }

    if (transmogSettings.showEvoker) {
        classMask |= PlayableClassMask.Evoker;
    }
    if (transmogSettings.showHunter) {
        classMask |= PlayableClassMask.Hunter;
    }
    if (transmogSettings.showShaman) {
        classMask |= PlayableClassMask.Shaman;
    }

    if (transmogSettings.showDeathKnight) {
        classMask |= PlayableClassMask.DeathKnight;
    }
    if (transmogSettings.showPaladin) {
        classMask |= PlayableClassMask.Paladin;
    }
    if (transmogSettings.showWarrior) {
        classMask |= PlayableClassMask.Warrior;
    }

    return classMask;
}
