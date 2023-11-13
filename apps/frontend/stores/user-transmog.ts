import { get } from 'svelte/store'

import { userModifiedStore } from './user-modified'
import { WritableFancyStore } from '@/types/fancy-store'
import type { UserTransmogData } from '@/types/data'
import type { Settings } from '@/shared/stores/settings/types/settings'
import type { UserAchievementData } from '@/types/user-achievement-data'


export class UserTransmogDataStore extends WritableFancyStore<UserTransmogData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            const modified = get(userModifiedStore).transmog
            url = url.replace(/\/(?:public|private).+$/, `/transmog-${modified}.json`)
        }
        return url
    }

    initialize(data: UserTransmogData): void {
        console.time('UserTransmogDataStore.initialize')

        data.hasAppearance = new Set<number>(data.appearanceIds || [])
        data.hasIllusion = new Set<number>(data.illusionIds || [])
        data.hasSource = new Set<string>(data.appearanceSources || [])

        console.timeEnd('UserTransmogDataStore.initialize')
    }

    setup(
        settings: Settings,
        userAchievementData: UserAchievementData
    ): void {
        console.time('UserTransmogDataStore.setup')

        const userTransmogData = this.value

        // HACK: Warglaives of Azzinoth
        if (userAchievementData.achievements[426]) {
            userTransmogData.hasSource.add('32837_0')
            userTransmogData.hasSource.add('32838_0')
        }

        console.timeEnd('UserTransmogDataStore.setup')
    }
}

export const userTransmogStore = new UserTransmogDataStore()
