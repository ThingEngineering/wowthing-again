import Base64ArrayBuffer from 'base64-arraybuffer'
import toPairs from 'lodash/toPairs'

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
        console.time('UserQuestDataStore.initialize')
        for (const [, characterData] of toPairs(userQuestData.characters)) {
            if (characterData.dailyQuests === undefined) {
                characterData.dailyQuests = new Map<number, boolean>()
                this.unpack(characterData.dailyQuests, characterData.dailyQuestsPacked)
                characterData.dailyQuestsPacked = null
            }

            if (characterData.quests === undefined) {
                characterData.quests = new Map<number, boolean>()
                this.unpack(characterData.quests, characterData.questsPacked)
                this.unpack(characterData.quests, characterData.otherQuestsPacked)
                characterData.otherQuestsPacked = null
                characterData.questsPacked = null
            }

            if (characterData.weeklyQuests === undefined) {
                characterData.weeklyQuests = new Map<number, boolean>()
                this.unpack(characterData.weeklyQuests, characterData.weeklyQuestsPacked)
                characterData.weeklyQuestsPacked = null
            }
        }

        console.timeEnd('UserQuestDataStore.initialize')
    }

    private unpack(map: Map<number, boolean>, data: string): void {
        if (data === null) {
            return
        }

        const decoded = new Uint16Array(Base64ArrayBuffer.decode(data))
        for (let i = 0; i < decoded.length; i++) {
            map.set(decoded[i], true)
        }
    }
}

export const userQuestStore = new UserQuestDataStore()
