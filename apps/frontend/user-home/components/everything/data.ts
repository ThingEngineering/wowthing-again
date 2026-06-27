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
    'darkspear-dash': {
        name: 'Darkspear Dash',
        tag: 'event:darkspear-dash',
        vendorsKey: ['world-events', 'darkspear-dash'],
    },
    'day-of-the-dead': {
        name: 'Day of the Dead',
        tag: 'event:day-of-the-dead',
        achievementsKey: ['world-events', 'day-of-the-dead'],
        vendorsKey: ['world-events', 'day-of-the-dead'],
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

    // Timewalking
    'timewalking-classic': {
        name: 'Classic Timewalking',
        tag: 'event:timewalking-classic',
        vendorsKey: ['classic', 'timewalking'],
    },
    'timewalking-tbc': {
        name: 'TBC Timewalking',
        tag: 'event:timewalking-tbc',
        vendorsKey: ['burning-crusade', 'timewalking'],
    },
    'timewalking-wotlk': {
        name: 'WotLK Timewalking',
        tag: 'event:timewalking-wotlk',
    },
    'timewalking-cata': {
        name: 'Cata Timewalking',
        tag: 'event:timewalking-cata',
        vendorsKey: ['cataclysm', 'timewalking'],
    },
    'timewalking-mop': {
        name: 'MoP Timewalking',
        tag: 'event:timewalking-mop',
        vendorsKey: ['mists-of-pandaria', 'timewalking'],
    },
    'timewalking-wod': {
        name: 'WoD Timewalking',
        tag: 'event:timewalking-wod',
        vendorsKey: ['warlords-of-draenor', 'timewalking'],
    },
    'timewalking-legion': {
        name: 'Legion Timewalking',
        tag: 'event:timewalking-legion',
        vendorsKey: ['legion', 'timewalking'],
    },
    'timewalking-bfa': {
        name: 'BfA Timewalking',
        tag: 'event:timewalking-bfa',
        vendorsKey: ['battle-for-azeroth', 'timewalking'],
    },
    'timewalking-sl': {
        name: 'SL Timewalking',
        tag: 'event:timewalking-sl',
    },
    'timewalking-df': {
        name: 'DF Timewalking',
        tag: 'event:timewalking-df',
    },

    //
    'cup-outland': {
        name: 'Outland Cup',
        tag: 'event:outland-cup',
        achievementsKey: ['outland-cup-hidden'],
        vendorsKey: ['world-events', 'outland-cup'],
    },
    //
    anniversary: {
        name: 'Anniversary',
        tag: 'event:anniversary',
        achievementsKey: ['world-events', 'anniversary-celebration'],
        vendorsKey: ['world-events', 'anniversary'],
    },
};
