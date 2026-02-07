import { DateTime } from 'luxon';

export class StaticDataHoliday {
    public startDates: DateTime[];

    constructor(
        public id: number,
        public nameId: number,
        public descriptionId: number,
        public name: string,
        public filterType: number,
        public flags: number,
        public looping: number,
        public priority: number,
        public regionMask: number,
        public durations: number[],
        startDates: number[]
    ) {
        this.startDates = startDates.map((unixTime) => DateTime.fromSeconds(unixTime));
    }
}
export type StaticDataHolidayArray = ConstructorParameters<typeof StaticDataHoliday>;
