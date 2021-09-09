import Base64ArrayBuffer from 'base64-arraybuffer'

import {WritableFancyStore} from '@/types'
import type {UserQuestData} from '@/types/data'


export class UserQuestDataStore extends WritableFancyStore<UserQuestData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            url += '/quests'
        }
        return url
    }

    initialize(userQuestData: UserQuestData): void {
        console.time('setup UserQuestDataStore')

        userQuestData.quests = {}

        for (const characterId in userQuestData.questsPacked) {
            userQuestData.quests[characterId] = new Map<number, boolean>()

            const decoded = new Uint16Array(Base64ArrayBuffer.decode(userQuestData.questsPacked[characterId]))
            for (let i = 0; i < decoded.length; i++) {
                userQuestData.quests[characterId].set(decoded[i], true)
            }
        }

        userQuestData.questsPacked = null

        console.timeEnd('setup UserQuestDataStore')
    }
}

export const userQuestStore = new UserQuestDataStore()
