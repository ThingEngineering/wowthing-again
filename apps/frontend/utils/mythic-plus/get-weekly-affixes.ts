import { Constants } from '@/data/constants';
import { seasonMap, weeklyAffixes } from '@/data/mythic-plus';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';
import type { StaticDataKeystoneAffix } from '@/shared/stores/static/types';
import type { Character } from '@/types';

export function getWeeklyAffixes(character?: Character): StaticDataKeystoneAffix[] {
    if (!seasonMap[Constants.mythicPlusSeason]) {
        return [];
    }

    const regionId = character?.realm.region || userState.general.allRegions[0];
    const startPeriod = seasonMap[Constants.mythicPlusSeason].startPeriod;
    const currentPeriod = userState.general.currentPeriod[regionId];
    if (!startPeriod || !currentPeriod) {
        return [];
    }

    return (
        weeklyAffixes[(currentPeriod.id - startPeriod) % weeklyAffixes.length]?.map((affixSlug) =>
            wowthingData.static.keystoneAffixBySlug.get(affixSlug)
        ) || []
    );
}
