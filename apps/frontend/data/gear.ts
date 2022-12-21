import { InventoryType } from '@/enums'


export const currentTier = {
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
        InventoryType.Hands,
        InventoryType.Legs,
    ],
}
