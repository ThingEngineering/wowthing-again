import { Profession } from '@/enums'
import type { ProfessionCooldownData } from '@/types'


export const professionCooldowns: ProfessionCooldownData[] = [
    // Alchemy
    {
        key: 'dfTransmute',
        name: '[DF] Transmute',
        profession: Profession.Alchemy,
        cooldown: [
            [86400], // 24h
            [60480, 2823, 19538, 21], // 16h48m @ 20 points in Transmutation
        ]
    },
    
    // Jewelcrafting
    {
        key: 'dfJeweledDragonsHeart',
        name: "[DF] Jeweled Dragon's Heart",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },
    {
        key: 'dfDreamersVision',
        name: "[DF] Dreamer's Vision",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },
    {
        key: 'dfEarthwardensPrize',
        name: "[DF] Earthwarden's Prize",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },
    {
        key: 'dfKeepersGlory',
        name: "[DF] Keeper's Glory",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },
    {
        key: 'dfQueensGift',
        name: "[DF] Queen's Gift",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },
    {
        key: 'dfTimewatchersPatience',
        name: "[DF] Timewatcher's Patience",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ]
    },

    // Tailoring
    {
        key: 'dfAzureweave',
        name: '[DF] Azureweave',
        profession: Profession.Tailoring,
        cooldown: [
            [60480], // 16h48m
            [43200, 2831, 40072, 1], // 12h @ unlocked Azureweaving
            [30240, 2831, 40072, 21], // 8h24m @ 20 points in Azureweaving
        ]
    },
    {
        key: 'dfChronocloth',
        name: '[DF] Chronocloth',
        profession: Profession.Tailoring,
        cooldown: [
            [60480], // 16h48m
            [43200, 2831, 40070, 1], // 12h @ unlocked Timeweaving
            [30240, 2831, 40070, 21], // 8h24m @ 20 points in Timeweaving
        ]
    },
]
