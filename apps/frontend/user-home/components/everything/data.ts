export type EverythingData = {
    name: string;
    tag: string;
    vendorsKey?: string;
};

export const everythingData: Record<string, EverythingData> = {
    brewfest: {
        name: 'Brewfest',
        tag: 'event:brewfest',
        vendorsKey: 'world-events--brewfest',
    },
};
