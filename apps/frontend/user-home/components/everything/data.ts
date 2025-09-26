export type EverythingData = {
    name: string;
    tag: string;
    achievementsKey?: string[];
    vendorsKey?: string[];
};

export const everythingData: Record<string, EverythingData> = {
    brewfest: {
        name: 'Brewfest',
        tag: 'event:brewfest',
        achievementsKey: ['world-events', 'brewfest'],
        vendorsKey: ['world-events', 'brewfest'],
    },
};
