import type { StaticDataReputationTier } from '@/types/data/static'


export const extraReputationTiers: StaticDataReputationTier[] = [
    {
        id: 325,
        minValues: [0, 3500, 10500],
        maxValues: [3500, 10500, 42000],
        names: ['Nascent', 'Juvenile', 'Mature'],
    },
    {
        id: 326,
        minValues: [0, 7000, 21000],
        maxValues: [7000, 21000, 42000],
        names: ['Nascent', 'Juvenile', 'Mature'],
    },
    {
        id: 327,
        minValues: [0, 14000, 42000],
        maxValues: [14000, 42000, 42000],
        names: ['Nascent', 'Juvenile', 'Mature'],
    },
]

export const factionMaxRenown: Record<number, number> = {
    2507: 25, // Dragonscale Expedition
    2511: 30, // Iskaara Tuskarr
    2503: 25, // Maruuk Centaur
    2510: 30, // Valdrakken Accord
}
