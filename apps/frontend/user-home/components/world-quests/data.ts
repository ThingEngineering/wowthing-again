import { QuestInfoType } from '@/shared/stores/static/enums'
import type { WorldQuestZone } from './types'


export const zoneData: WorldQuestZone[] = [
    {
        id: 2222,
        name: 'Dragon Isles',
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
            null,
            {
                id: 2133,
                name: 'Zaralek Cavern',
                slug: 'zaralek-cavern',
                mapName: '09-dragonflight/zaralek_cavern',
                continentPoint: [97, 90],
                anchor: 'bottom-right',
            },
            null,
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
]

export const worldQuestPrereqs: Record<number, number> = {
    74501: 75888, // Suffusion Camp: Cinderwind
    75280: 75888, // Suffusion Camp: Frostburn
}

export const questInfoIcon: Record<number, string> = {
    [QuestInfoType.DragonRacing]: 'gameSpikedDragonHead',
    [QuestInfoType.PetBattle]: 'mdiDuck',
    [QuestInfoType.Pvp]: 'gameCrossedSwords',
}
