import { Writable, writable } from 'svelte/store'

import fetch_json from '../utils/fetch-json'


export const error = writable(false)
export const loading = writable(true)
export const data = writable({})

export const fetch = async function() {
    const url = document.getElementById('app').getAttribute('data-static')
    const json = await fetch_json(url)
    console.log({url, json})
    if (json === null) {
        error.set(true)
        return
    }

    data.set(JSON.parse(json))
    loading.set(false)
}

export default {
    error,
    loading,
    data,
    fetch,
}
