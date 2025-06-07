import { DateTime } from 'luxon';
import { readable } from 'svelte/store';

// A simple store that updates once per minute, allows time-based reactivity without
// continuously checking current time
export const timeStore = readable(DateTime.utc(), function start(set) {
    const interval = setInterval(() => {
        set(DateTime.utc());
    }, 60000);

    return function stop() {
        clearInterval(interval);
    };
});
