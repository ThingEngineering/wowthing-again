import { writable } from 'svelte/store'

import { objectKeys } from '@/utils/object-keys'


const storageKey = 'browserStore'

class BrowserState {
    home = new BrowserStateHome()
    matrix = new BrowserStateMatrix()
}

class BrowserStateHome {
    activeView: string = ''
}

class BrowserStateMatrix {
    minLevel = 0
    showCharacterAs: 'level' | 'name' = 'level'
    showCovenant = false
    xAxis: string[] = []
    yAxis: string[] = []
}

const initialState = new BrowserState()
const userJson = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
for (const key of objectKeys(initialState)) {
    const subKeys = objectKeys(initialState[key])

    Object.assign(initialState[key], userJson[key] || {})
    for (const objectKey of objectKeys(initialState[key])) {
        console.log(subKeys, objectKey)
        if (subKeys.indexOf(objectKey) === -1) {
            delete initialState[key][objectKey]
        }
    }
}

export const browserStore = writable<BrowserState>(initialState)

browserStore.subscribe(state => {
    localStorage.setItem(storageKey, JSON.stringify(state))
})
