import { get } from 'svelte/store'

import { userModifiedStore } from './user-modified'
import { WritableFancyStore } from '@/types/fancy-store'
import type { UserQuestData } from '@/types/data'


export class UserQuestDataStore extends WritableFancyStore<UserQuestData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            const modified = get(userModifiedStore).quests
            url = url.replace(/\/(?:public|private).+$/, `/quests-${modified}.json`)
        }
        return url
    }

    initialize(userQuestData: UserQuestData): void {
        console.time('UserQuestDataStore.initialize')

        if (userQuestData.accountHas === undefined) {
            userQuestData.accountHas = new Set<number>(userQuestData.account || [])
            userQuestData.account = null
        }
        
        userQuestData.questNames = {}
        for (const [, characterData] of Object.entries(userQuestData.characters)) {
            if (characterData.dailyQuests === undefined) {
                characterData.dailyQuests = new Set<number>(characterData.dailyQuestList)
                characterData.dailyQuestList = null
            }

            if (characterData.quests === undefined) {
                characterData.quests = new Set<number>(characterData.questList)
                characterData.questList = null
            }

            for (const [key, progressQuest] of Object.entries(characterData.progressQuests || {})) {
                userQuestData.questNames[key] ||= progressQuest.name
            }
        }

        console.timeEnd('UserQuestDataStore.initialize')
    }

    hasAny(characterId: number, questId: number): boolean {
        const charData = this.value.characters[characterId]
        return charData?.dailyQuests?.has(questId) || charData?.quests?.has(questId)
    }
}

export const userQuestStore = new UserQuestDataStore()
