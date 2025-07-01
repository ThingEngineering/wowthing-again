import { DateTime } from 'luxon';

class TimeState {
    public time: DateTime = $state(DateTime.utc());

    private interval: ReturnType<typeof setInterval>;

    constructor() {
        this.interval = setInterval(() => {
            this.time = DateTime.utc();
        }, 60_000);
    }
}

export const timeState = new TimeState();
