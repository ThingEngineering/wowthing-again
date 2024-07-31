import { writable } from 'svelte/store'

import { Region } from '@/enums/region'


export class WorldQuestsState {
    public region: Region = Region.US
}

const key = 'state-world-quests'
const initialState = new WorldQuestsState()
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'))

export const worldQuestState = writable<WorldQuestsState>(initialState)

worldQuestState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
