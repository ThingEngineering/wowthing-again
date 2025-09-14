import { DateTime } from 'luxon';

class TimeState {
    /** Time state that updates every 1 minute */
    public time: DateTime = $state<DateTime>();
    /** Time state that updates every 10 minutes */
    public slowTime: DateTime = $state<DateTime>();

    private interval: ReturnType<typeof setInterval>;

    constructor() {
        this.time = this.slowTime = DateTime.utc();

        const millis = this.time.toMillis();
        const remainder = millis % 60_000;
        const sleepFor = 60_000 - remainder;

        setTimeout(() => {
            this.interval = setInterval(() => {
                const now = DateTime.utc();
                this.time = now;
                if (now.minute % 10 === 1) {
                    this.slowTime = now;
                }
            }, 60_000);
        }, sleepFor);
    }
}

export const timeState = new TimeState();
