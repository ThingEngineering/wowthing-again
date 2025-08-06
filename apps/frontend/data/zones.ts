import type { ProfessionZone } from './professions/zone';

export const warWithinZones: ProfessionZone[] = [
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
        name: 'City of Threads',
        icon: 'achievement/40376',
        map: '10-the-war-within/city_of_threads',
        shortName: 'CoT',
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
    null,
    {
        name: "Artisan's Consortium Books",
        icon: 'spell/339979', // Booksmart
        shortName: 'AC',
    },
    {
        name: 'Assembly of the Deeps Books',
        icon: 'achievement/40836',
        shortName: 'AotD',
        reputationId: 2594,
    },
    {
        name: 'Council of Dornogal Books',
        icon: 'achievement/40856',
        shortName: 'CoD',
        reputationId: 2590,
    },
    {
        name: 'Hallowfall Arathi Books',
        icon: 'achievement/40845',
        shortName: 'HA',
        reputationId: 2570,
    },
    {
        name: 'City of Threads Books',
        icon: 'achievement/40838',
        shortName: 'CoT',
    },
    {
        name: 'Undermine Books',
        icon: 'achievement/40900',
        // map: '10-the-war-within/undermine',
        shortName: 'UM',
    },
    {
        name: 'Tazavesh Books',
        icon: 'achievement/42022',
        shortName: 'TV',
    },
];

export const zoneShortName: Record<string, string> = Object.fromEntries(
    warWithinZones.filter((zone) => zone !== null).map((zone) => [zone.map, zone.shortName])
);
