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
    'childrens-week': {
        name: "Children's Week",
        tag: 'event:childrens-week',
        achievementsKey: ['world-events', 'childrens-week'],
        vendorsKey: ['world-events', 'childrens-week'],
    },
    'darkmoon-faire': {
        name: 'Darkmoon Faire',
        tag: 'event:darkmoon-faire',
        achievementsKey: ['world-events', 'darkmoon-faire'],
        vendorsKey: ['world-events', 'darkmoon-faire'],
    },
    'hallows-end': {
        name: "Hallow's End",
        tag: 'event:hallows-end',
        achievementsKey: ['world-events', 'hallows-end'],
        vendorsKey: ['world-events', 'hallows-end'],
    },
    'love-is-in-the-air': {
        name: 'Love is in the Air',
        tag: 'event:love-is-in-the-air',
        achievementsKey: ['world-events', 'love-is-in-the-air'],
        vendorsKey: ['world-events', 'love-is-in-the-air'],
    },
    'lunar-festival': {
        name: 'Lunar Festival',
        tag: 'event:lunar-festival',
        achievementsKey: ['world-events', 'lunar-festival'],
        vendorsKey: ['world-events', 'lunar-festival'],
    },
    'midsummer-fire-festival': {
        name: 'Midsummer Fire Festival',
        tag: 'event:midsummer-fire-festival',
        achievementsKey: ['world-events', 'midsummer'],
        vendorsKey: ['world-events', 'midsummer-fire-festival'],
    },
    noblegarden: {
        name: 'Noblegarden',
        tag: 'event:noblegarden',
        achievementsKey: ['world-events', 'noblegarden'],
        vendorsKey: ['world-events', 'noblegarden'],
    },
    'pilgrims-bounty': {
        name: "Pilgrim's Bounty",
        tag: 'event:pilgrims-bounty',
        achievementsKey: ['world-events', 'pilgrims-bounty'],
        vendorsKey: ['world-events', 'pilgrims-bounty'],
    },
    'trial-of-style': {
        name: 'Trial of Style',
        tag: 'event:trial-of-style',
        vendorsKey: ['world-events', 'trial-of-style'],
    },
    'winter-veil': {
        name: 'Winter Veil',
        tag: 'event:winter-veil',
        achievementsKey: ['world-events', 'winter-veil'],
        vendorsKey: ['world-events', 'winter-veil'],
    },
};
