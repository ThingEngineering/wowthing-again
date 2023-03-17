import find from 'lodash/find'
import { get } from 'svelte/store'

import { seasonMap, weeklyAffixes } from '@/data/dungeon'
import { staticStore, userStore } from '@/stores'
import type { Character } from '@/types'
import type { StaticDataKeystoneAffix } from '@/types/data/static'
import { Constants } from '@/data/constants'


export function getWeeklyAffixes(character?: Character): StaticDataKeystoneAffix[] {
    const staticData = get(staticStore)
    const userData = get(userStore)

    const regionId = character?.realm.region || userData.allRegions[0]
    const startPeriod = seasonMap[Constants.mythicPlusSeason].startPeriod
    return weeklyAffixes[(userData.currentPeriod[regionId].id - startPeriod) % weeklyAffixes.length]
        .map((affixSlug) => find(staticData.keystoneAffixes, (ka) => ka.slug === affixSlug))
}
