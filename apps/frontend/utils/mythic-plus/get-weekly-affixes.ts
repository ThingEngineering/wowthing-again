import { get } from 'svelte/store';

import { Constants } from '@/data/constants';
import { seasonMap, weeklyAffixes } from '@/data/mythic-plus';
import { wowthingData } from '@/shared/stores/data';
import { userStore } from '@/stores';
import { userState } from '@/user-home/state/user';
import type { StaticDataKeystoneAffix } from '@/shared/stores/static/types';
import type { Character } from '@/types';

export function getWeeklyAffixes(character?: Character): StaticDataKeystoneAffix[] {
    const userData = get(userStore);

    const regionId = character?.realm.region || userState.general.allRegions[0];
    const startPeriod = seasonMap[Constants.mythicPlusSeason].startPeriod;
    const currentPeriod = userData.currentPeriod[regionId];
    if (!startPeriod || !currentPeriod) {
        return [];
    }

    return (
        weeklyAffixes[(currentPeriod.id - startPeriod) % weeklyAffixes.length]?.map((affixSlug) =>
            wowthingData.static.keystoneAffixBySlug.get(affixSlug)
        ) || []
    );
}
