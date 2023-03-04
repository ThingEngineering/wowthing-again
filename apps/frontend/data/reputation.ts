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

export const contractAuras: Record<number, [number, number]> = {
    384317: [2544, 1], // Contract: Artisan's Consortium 1
    384320: [2544, 2], // Contract: Artisan's Consortium 2
    384321: [2544, 3], // Contract: Artisan's Consortium 3
    384468: [2507, 1], // Contract: Dragonscale Expedition 1
    384469: [2507, 2], // Contract: Dragonscale Expedition 2
    384470: [2507, 3], // Contract: Dragonscale Expedition 3
    384461: [2511, 1], // Contract: Iskaara Tuskarr 1
    384460: [2511, 2], // Contract: Iskaara Tuskarr 2
    384459: [2511, 3], // Contract: Iskaara Tuskarr 3
    384465: [2503, 1], // Contract: Maruuk Centaur 1
    384466: [2503, 2], // Contract: Maruuk Centaur 2
    384467: [2503, 3], // Contract: Maruuk Centaur 3
    384462: [2510, 1], // Contract: Valdrakken Accord 1
    384463: [2510, 1], // Contract: Valdrakken Accord 2
    384464: [2510, 1], // Contract: Valdrakken Accord 3
}
