import { writable } from 'svelte/store'

import {Character, UserData} from '@/types'
import fetch_json from '@/utils/fetch-json'
import initializeUser from '@/utils/initialize-user'


export const error = writable(false)
export const loading = writable(true)
export const data = writable<UserData>(new UserData())

export const fetch = async function() {
    const url = document.getElementById('app').getAttribute('data-user')
    const json = await fetch_json(url)
    if (json === null) {
        error.set(true)
        return
    }

    const temp = JSON.parse(json)
    let characters = temp.characters.map((c) => Object.assign(new Character(), c))
    characters.sort((a, b) => {
        if (a.level != b.level) return b.level - a.level
        return a.name.localeCompare(b.name)
    })
    temp.characters = characters

    initializeUser(temp)

    data.set(temp as UserData)
    loading.set(false)
}

export default {
    error,
    loading,
    data,
    fetch,
}
