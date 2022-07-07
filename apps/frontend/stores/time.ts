import { DateTime } from 'luxon'
import { readable } from 'svelte/store'


export const timeStore = readable(DateTime.utc(), function start(set) {
    const interval = setInterval(() => {
        set(DateTime.utc())
    }, 60000)

    return function stop() {
        clearInterval(interval)
    }
})
