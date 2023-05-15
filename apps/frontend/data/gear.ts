import { InventoryType } from '@/enums'


export type TierData = {
    sets: {
        [k: string]: boolean
    }
    slots: InventoryType[]
}

export const currentTier: TierData = {
    sets: Object.fromEntries([
        'transmog:2870', // Death Knight
        'transmog:2869', // Demon Hunter
        'transmog:2868', // Druid
        'transmog:2867', // Evoker
        'transmog:2866', // Hunter
        'transmog:2865', // Mage
        'transmog:2864', // Monk
        'transmog:2859', // Paladin
        'transmog:2863', // Priest
        'transmog:2862', // Rogue
        'transmog:2861', // Shaman
        'transmog:2860', // Warlock
        'transmog:2858', // Warrior
    ].map((name) => [name, true])),
    slots: [
        InventoryType.Head,
        InventoryType.Shoulders,
        InventoryType.Chest,
        InventoryType.Chest2,
        InventoryType.Hands,
        InventoryType.Legs,
    ],
}

export const previousTier: TierData = {
    sets: Object.fromEntries([
        'transmog:2616', // Death Knight
        'transmog:2619', // Demon Hunter
        'transmog:2622', // Druid
        'transmog:2625', // Evoker
        'transmog:2628', // Hunter
        'transmog:2631', // Mage
        'transmog:2634', // Monk
        'transmog:2637', // Paladin
        'transmog:2640', // Priest
        'transmog:2643', // Rogue
        'transmog:2646', // Shaman
        'transmog:2649', // Warlock
        'transmog:2652', // Warrior
    ].map((name) => [name, true])),
    slots: [
        InventoryType.Head,
        InventoryType.Shoulders,
        InventoryType.Chest,
        InventoryType.Chest2,
        InventoryType.Hands,
        InventoryType.Legs,
    ],
}
