import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import debounce from 'lodash/debounce';
// import { createEventDispatcher, type EventDispatcher } from 'svelte'
import { get, readable } from 'svelte/store';

import { settingsState } from '@/shared/state/settings.svelte';
import { timeStore } from '@/shared/stores/time';
import { userAchievementStore, userQuestStore, userStore } from '@/stores';

function createStore() {
    const store = readable<string>();

    let connection: HubConnection;
    // let dispatch: EventDispatcher<any>
    let updatedKeys: Record<string, string> = {};

    const doUpdates = debounce(async () => {
        const keyEntries = Object.entries(updatedKeys);
        updatedKeys = {};
        console.log('Updating', keyEntries);
        for (const [key, timestamp] of keyEntries) {
            if (key === 'achievements') {
                await userAchievementStore.fetch({ evenIfLoaded: true, timestamp });
            } else if (key === 'general') {
                await userStore.fetch({ evenIfLoaded: true, timestamp });
                userStore.setup(settingsState.value, get(userStore));
            } else if (key === 'quests') {
                await userQuestStore.fetch({ evenIfLoaded: true, timestamp });
                userQuestStore.setup(get(timeStore));
            } else {
                console.warn('Unknown key', key, timestamp);
            }
        }
    }, 5000);

    const onDataUpdated = (key: string, timestamp: string) => {
        updatedKeys[key] = timestamp;
        doUpdates();
    };

    return {
        connect: () => {
            if (connection) {
                return;
            }

            // dispatch = createEventDispatcher()

            connection = new HubConnectionBuilder()
                .withUrl('/userUpdate')
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            connection.start();

            connection.on('dataUpdated', onDataUpdated);
        },
        disconnect: () => {
            if (!connection) {
                return;
            }

            connection.stop();
        },
        subscribe: store.subscribe,
    };
}

export const userUpdateHubStore = createStore();
