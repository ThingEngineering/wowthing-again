import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { createEventDispatcher, type EventDispatcher } from 'svelte'
import { readable } from 'svelte/store'


function createStore() {
    const store = readable<string>()

    let connection: HubConnection
    let dispatch: EventDispatcher<any>

    return {
        connect: () => {
            if (connection) { return }

            dispatch = createEventDispatcher()

            connection = new HubConnectionBuilder()
                .withUrl('/userUpdate')
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build()
            
            connection.start()

            connection.on('dataUpdated', (args) => {
                console.log(args)
                dispatch('data-updated', args)
            })
        },
        subscribe: store.subscribe,
    }
}

export const userUpdateHubStore = createStore()
