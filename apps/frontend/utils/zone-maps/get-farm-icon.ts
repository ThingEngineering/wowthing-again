import { FarmType } from '@/enums/farm-type';
import { iconLibrary } from '@/shared/icons';
import { farmTypeIcons, professionSlugIcons } from '@/shared/icons/mappings';
import type { ManualDataZoneMapFarm } from '@/types/data/manual';
import type { Icon } from '@/types/icons';

export function getFarmIcon(farm: ManualDataZoneMapFarm): [Icon, string] {
    const professionLimits: Record<string, boolean> = {};
    for (const drop of farm.drops || []) {
        if (drop.limit?.[0] === 'profession') {
            professionLimits[drop.limit[1]] = true;
        }
    }

    const keys = Object.keys(professionLimits);
    let icon: Icon;
    if (farm.drops?.length === 1 && keys.length === 1 && farm.type !== FarmType.Kill) {
        icon = professionSlugIcons[keys[0]];
    } else if (farm.isPhased) {
        icon = farm.type === FarmType.Kill ? iconLibrary.mdiGhost : iconLibrary.mdiGhost;
    } else {
        icon = farmTypeIcons[farm.type];
    }

    return [icon, getIconScaling(icon) || '0.8'];
}

function getIconScaling(icon: Icon) {
    switch (icon) {
        case iconLibrary.gamePresent:
            return '0.9';
        case iconLibrary.gameTrophy:
            return '0.75';
        case iconLibrary.mdiLetterC:
        case iconLibrary.mdiLetterL:
        case iconLibrary.mdiLetterM:
        case iconLibrary.mdiLetterP:
            return '0.9';
    }
    return '0.8';
}
