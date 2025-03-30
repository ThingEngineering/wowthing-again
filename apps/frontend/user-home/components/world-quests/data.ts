import { QuestInfoType } from '@/shared/stores/static/enums';
import type { WorldQuestZone } from './types';

export const zoneData: WorldQuestZone[] = [
    {
        id: 2274,
        name: '[TWW] The War Within',
        slug: 'war-within',
        mapName: '10-the-war-within/khaz_algar',
        children: [
            {
                id: 2346,
                name: 'Undermine',
                slug: 'undermine',
                mapName: '10-the-war-within/undermine',
                continentPoint: [80, 80],
                anchor: 'top-left',
            },
            {
                id: 2369,
                name: 'Siren Isle',
                slug: 'siren-isle',
                mapName: '10-the-war-within/siren_isle',
                continentPoint: [90, 90],
                anchor: 'top-left',
            },
            null,
            {
                id: 2255,
                name: 'Azj-Kahet',
                slug: 'azj-kahet',
                mapName: '10-the-war-within/azj-kahet',
                continentPoint: [42, 78],
                anchor: 'top-left',
            },
            {
                id: 2215,
                name: 'Hallowfall',
                slug: 'hallowfall',
                mapName: '10-the-war-within/hallowfall',
                continentPoint: [30, 40],
                anchor: 'top-left',
            },
            {
                id: 2248,
                name: 'Isle of Dorn',
                slug: 'isle-of-dorn',
                mapName: '10-the-war-within/isle_of_dorn',
                continentPoint: [62, 24],
                anchor: 'top-left',
            },
            {
                id: 2214,
                name: 'Ringing Deeps',
                slug: 'ringing-deeps',
                mapName: '10-the-war-within/ringing_deeps',
                continentPoint: [52, 50],
                anchor: 'top-left',
            },
        ],
    },
    {
        id: 2222,
        name: '[DF] Dragon Isles',
        slug: 'dragon-isles',
        mapName: '09-dragonflight/dragon_isles',
        children: [
            {
                id: 2200,
                name: 'Emerald Dream',
                slug: 'emerald-dream',
                mapName: '09-dragonflight/emerald_dream',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 2133,
                name: 'Zaralek Cavern',
                slug: 'zaralek-cavern',
                mapName: '09-dragonflight/zaralek_cavern',
                continentPoint: [97, 90],
                anchor: 'bottom-right',
            },
            {
                id: 2151,
                name: 'Forbidden Reach',
                slug: 'forbidden-reach',
                mapName: '09-dragonflight/forbidden_reach',
                continentPoint: [69, 7],
                anchor: 'top-right',
            },
            null,
            {
                id: 2024,
                name: 'Azure Span',
                slug: 'azure-span',
                mapName: '09-dragonflight/azure_span',
                continentPoint: [61, 80],
                anchor: 'bottom-right',
            },
            {
                id: 2023,
                name: "Ohn'ahran Plains",
                slug: 'ohnahran-plains',
                mapName: '09-dragonflight/ohnahran_plains',
                continentPoint: [35, 62],
                anchor: 'bottom-left',
            },
            {
                id: 2025,
                name: 'Thaldraszus',
                slug: 'thaldraszus',
                mapName: '09-dragonflight/thaldraszus',
                continentPoint: [77, 54],
                anchor: 'bottom-right',
            },
            {
                id: 2022,
                name: 'Waking Shores',
                slug: 'waking-shores',
                mapName: '09-dragonflight/waking_shores',
                continentPoint: [41, 26],
                anchor: 'top-left',
            },
        ],
    },
    {
        id: 1550,
        name: '[SL] Shadowlands',
        slug: 'shadowlands',
        mapName: '08-shadowlands/shadowlands',
        children: [
            {
                id: 1565,
                name: 'Ardenweald',
                slug: 'ardenweald',
                mapName: '08-shadowlands/ardenweald',
                continentPoint: [42, 79],
                anchor: 'top-left',
            },
            {
                id: 1533,
                name: 'Bastion',
                slug: 'bastion',
                mapName: '08-shadowlands/bastion',
                continentPoint: [79, 57],
                anchor: 'bottom-right',
            },
            {
                id: 1536,
                name: 'Maldraxxus',
                slug: 'maldraxxus',
                mapName: '08-shadowlands/maldraxxus',
                continentPoint: [55, 21],
                anchor: 'top-left',
            },
            {
                id: 1525,
                name: 'Revendreth',
                slug: 'revendreth',
                mapName: '08-shadowlands/revendreth',
                continentPoint: [19, 54],
                anchor: 'bottom-left',
            },
        ],
    },
    {
        id: 876,
        name: '[BfA] Kul Tiras',
        slug: 'kul-tiras',
        mapName: '07-battle-for-azeroth/kul_tiras',
        children: [
            {
                id: 1462,
                name: 'Mechagon Island',
                slug: 'mechagon-island',
                mapName: '07-battle-for-azeroth/mechagon',
                continentPoint: [14, 28],
                anchor: 'top-left',
            },
            {
                id: 1355,
                name: 'Nazjatar',
                slug: 'nazjatar',
                mapName: '07-battle-for-azeroth/nazjatar',
                continentPoint: [94, 9],
                anchor: 'top-right',
            },
            null,
            {
                id: 896,
                name: 'Drustvar',
                slug: 'drustvar',
                mapName: '07-battle-for-azeroth/drustvar',
                continentPoint: [26, 81],
                anchor: 'bottom-left',
            },
            {
                id: 942,
                name: 'Stormsong Valley',
                slug: 'stormsong-valley',
                mapName: '07-battle-for-azeroth/stormsong_valley',
                continentPoint: [51, 27],
                anchor: 'bottom-left',
            },
            {
                id: 895,
                name: 'Tiragarde Sound',
                slug: 'tiragarde-sound',
                mapName: '07-battle-for-azeroth/tiragarde_sound',
                continentPoint: [54, 73],
                anchor: 'top-left',
            },
        ],
    },
    {
        id: 875,
        name: '[BfA] Zandalar',
        slug: 'zandalar',
        mapName: '07-battle-for-azeroth/zandalar',
        children: [
            {
                id: 1355,
                name: 'Nazjatar',
                slug: 'nazjatar',
                mapName: '07-battle-for-azeroth/nazjatar',
                continentPoint: [94, 9],
                anchor: 'top-right',
            },
            null,
            {
                id: 863,
                name: 'Nazmir',
                slug: 'nazmir',
                mapName: '07-battle-for-azeroth/nazmir',
                continentPoint: [68, 25],
                anchor: 'top-right',
            },
            {
                id: 864,
                name: "Vol'dun",
                slug: 'voldun',
                mapName: '07-battle-for-azeroth/voldun',
                continentPoint: [33, 30],
                anchor: 'bottom-left',
            },
            {
                id: 862,
                name: 'Zuldazar',
                slug: 'zuldazar',
                mapName: '07-battle-for-azeroth/zuldazar',
                continentPoint: [52, 54],
                anchor: 'top-left',
            },
        ],
    },
    {
        id: 905,
        name: '[Leg] Broken Isles',
        slug: 'broken-isles',
        mapName: '06-legion/broken_isles',
        children: [
            {
                id: 630,
                name: 'Azsuna',
                slug: 'azsuna',
                mapName: '06-legion/azsuna',
                continentPoint: [26, 60],
                anchor: 'top-left',
            },
            {
                id: 634,
                name: 'Stormheim',
                slug: 'stormheim',
                mapName: '06-legion/stormheim',
                continentPoint: [55.5, 32],
                anchor: 'top-left',
            },
            {
                id: 641,
                name: "Val'sharah",
                slug: 'valsharah',
                mapName: '06-legion/valsharah',
                continentPoint: [22.5, 49],
                anchor: 'bottom-left',
            },
            {
                id: 646,
                name: 'Broken Shore',
                slug: 'broken-shore',
                mapName: '06-legion/broken_shore',
                continentPoint: [51, 64],
                anchor: 'top-left',
            },
            {
                id: 650,
                name: 'Highmountain',
                slug: 'highmountain',
                mapName: '06-legion/highmountain',
                continentPoint: [39, 20.5],
                anchor: 'top-left',
            },
            {
                id: 680,
                name: 'Suramar',
                slug: 'suramar',
                mapName: '06-legion/suramar',
                continentPoint: [39.5, 45],
                anchor: 'top-left',
            },
        ],
    },
    {
        id: 905,
        name: '[Leg] Argus',
        slug: 'argus',
        mapName: '06-legion/argus',
        children: [
            {
                id: 830,
                name: 'Krokuun',
                slug: 'krokuun',
                mapName: '06-legion/krokuun',
                continentPoint: [53, 77],
                anchor: 'top-left',
            },
            {
                id: 882,
                name: 'Eredath',
                slug: 'eredath',
                mapName: '06-legion/eredath',
                continentPoint: [54.5, 35],
                anchor: 'bottom-left',
            },
            {
                id: 885,
                name: 'Antoran Wastes',
                slug: 'antoran-wastes',
                mapName: '06-legion/antoran_wastes',
                continentPoint: [26, 58.5],
                anchor: 'bottom-left',
            },
        ],
    },
];

export const zoneMap = Object.fromEntries(
    zoneData.flatMap((zone) =>
        (zone.children || []).filter((zone) => !!zone).map((zone) => [zone.id, zone]),
    ),
);

export const worldQuestPrereqs: Record<number, number> = {
    74501: 75888, // Suffusion Camp: Cinderwind
    75280: 75888, // Suffusion Camp: Frostburn
};

export const questInfoIcon: Record<number, string> = {
    [QuestInfoType.DragonRacing]: 'gameSpikedDragonHead',
    [QuestInfoType.PetBattle]: 'mdiDuck',
    [QuestInfoType.Pvp]: 'gameCrossedSwords',
};
