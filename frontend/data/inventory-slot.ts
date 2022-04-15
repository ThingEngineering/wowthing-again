import type {Character} from '@/types'
import {InventorySlot, PrimaryStat} from '@/types/enums'
import {specializationMap} from '@/data/character-specialization'

export const slotOrder: InventorySlot[] = [
    InventorySlot.MainHand,
    InventorySlot.OffHand,
    InventorySlot.Head,
    InventorySlot.Neck,
    InventorySlot.Shoulders,
    InventorySlot.Back,
    InventorySlot.Chest,
    InventorySlot.Wrist,
    InventorySlot.Hands,
    InventorySlot.Waist,
    InventorySlot.Legs,
    InventorySlot.Feet,
    InventorySlot.Ring1,
    InventorySlot.Ring2,
    InventorySlot.Trinket1,
    InventorySlot.Trinket2,
]

export const validEnchants: Record<number, number[]> = {
    [InventorySlot.MainHand]: [
        3368, // Rune of the Fallen Crusader
        6196, // Optical Target Embiggener
        6223, // Lightless Force
        6228, // Sinful Revelation
        6229, // Celestial Guidance
    ],

    // TODO differentiate between off-hand items and weapons

    [InventorySlot.Back]: [
        6202, // Fortified Speed
        6203, // Fortified Avoidance
        6204, // Fortified Leech
        6208, // Soul Vitality
    ],

    [InventorySlot.Chest]: [
        6214, // Eternal Skirmish
        6217, // Eternal Bounds
        6230, // Eternal Stats
        6265, // Eternal Insight
    ],

    [InventorySlot.Ring1]: [
        6164, // Tenet of Critical Strike
        6166, // Tenet of Haste
        6168, // Tenet of Mastery
        6170, // Tenet of Versatility
    ],

    [InventorySlot.Ring2]: [
        6164, // Tenet of Critical Strike
        6166, // Tenet of Haste
        6168, // Tenet of Mastery
        6170, // Tenet of Versatility
    ],
}

export const specialValidEnchants: Record<number, SpecialValidEnchant> = {
    [InventorySlot.Hands]: {
        enchants: [
            6210, // Eternal Strength
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Strength
    },

    [InventorySlot.Wrist]: {
        enchants: [
            6220, // Eternal Intellect
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Intellect
    },

    [InventorySlot.Feet]: {
        enchants: [
            6211, // Eternal Agility
        ],
        checkFunc: (character: Character) =>
            specializationMap[character.activeSpecId]?.mainStat === PrimaryStat.Agility
    },
}

interface SpecialValidEnchant {
    enchants: number[]
    checkFunc: (character: Character) => boolean
}

export const gemBonusIds: number[] = [
    6935, // SL legendary socket?
    7576, // ??
    7580, // SL Season 3?
]
