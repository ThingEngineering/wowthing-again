import { QuestInfoType } from '@/shared/stores/static/enums';
import type { WorldQuestZone } from './types';

export const zoneData: WorldQuestZone[] = [
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
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 1533,
                name: 'Bastion',
                slug: 'bastion',
                mapName: '08-shadowlands/bastion',
                continentPoint: [97, 90],
                anchor: 'bottom-right',
            },
            {
                id: 1536,
                name: 'Maldraxxus',
                slug: 'maldraxxus',
                mapName: '08-shadowlands/maldraxxus',
                continentPoint: [69, 7],
                anchor: 'top-right',
            },
            {
                id: 1525,
                name: 'Revendreth',
                slug: 'revendreth',
                mapName: '08-shadowlands/revendreth',
                continentPoint: [69, 7],
                anchor: 'top-right',
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
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 1355,
                name: 'Nazjatar',
                slug: 'nazjatar',
                mapName: '07-battle-for-azeroth/nazjatar',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            null,
            {
                id: 896,
                name: 'Drustvar',
                slug: 'drustvar',
                mapName: '07-battle-for-azeroth/drustvar',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 942,
                name: 'Stormsong Valley',
                slug: 'stormsong-valley',
                mapName: '07-battle-for-azeroth/stormsong_valley',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 895,
                name: 'Tiragarde Sound',
                slug: 'tiragarde-sound',
                mapName: '07-battle-for-azeroth/tiragarde_sound',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
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
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            null,
            {
                id: 863,
                name: 'Nazmir',
                slug: 'nazmir',
                mapName: '07-battle-for-azeroth/nazmir',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 864,
                name: "Vol'dun",
                slug: 'voldun',
                mapName: '07-battle-for-azeroth/voldun',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
            {
                id: 862,
                name: 'Zuldazar',
                slug: 'zuldazar',
                mapName: '07-battle-for-azeroth/zuldazar',
                continentPoint: [32, 62],
                anchor: 'bottom-right',
            },
        ],
    },
];

export const worldQuestPrereqs: Record<number, number> = {
    74501: 75888, // Suffusion Camp: Cinderwind
    75280: 75888, // Suffusion Camp: Frostburn
};

export const questInfoIcon: Record<number, string> = {
    [QuestInfoType.DragonRacing]: 'gameSpikedDragonHead',
    [QuestInfoType.PetBattle]: 'mdiDuck',
    [QuestInfoType.Pvp]: 'gameCrossedSwords',
};
