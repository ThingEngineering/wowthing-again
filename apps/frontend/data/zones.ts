export const warWithinZones = [
    {
        name: 'Dornogal',
        icon: 'achievement/20597',
        map: '10-the-war-within/dornogal',
        shortName: 'Dor',
    },
    {
        name: 'Azj-Kahet',
        icon: 'achievement/19559',
        map: '10-the-war-within/azj-kahet',
        shortName: 'AK',
    },
    {
        name: 'Isle of Dorn',
        icon: 'achievement/20118',
        map: '10-the-war-within/isle_of_dorn',
        shortName: 'IoD',
    },
    {
        name: 'Hallowfall',
        icon: 'achievement/20598',
        map: '10-the-war-within/hallowfall',
        shortName: 'Hal',
    },
    {
        name: 'The Ringing Deeps',
        icon: 'achievement/19560',
        map: '10-the-war-within/ringing_deeps',
        shortName: 'RD',
    },
];

export const zoneShortName: Record<string, string> = Object.fromEntries(
    warWithinZones.map((zone) => [zone.map, zone.shortName]),
);
