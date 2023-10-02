import { InventoryType } from '@/enums/inventory-type'


export type TierData = {
    sets: {
        [k: string]: boolean
    }
    slots: InventoryType[]
}

export const currentTier: TierData = {
    sets: Object.fromEntries([
        // Death Knight - Lingering Phantom's Encasement
        'transmog:2870',
        'transmog:2895',
        'transmog:2896',
        'transmog:2897',
        // Demon Hunter - Kinslayer's Burdens
        'transmog:2869',
        'transmog:2901',
        'transmog:2902',
        'transmog:2903',
        // Druid - Strands of the Autumn Blaze
        'transmog:2868',
        'transmog:2892',
        'transmog:2893',
        'transmog:2894',
        // Evoker - Legacy of Obsidian Secrets
        'transmog:2867',
        'transmog:2904',
        'transmog:2905',
        'transmog:2906',
        // Hunter - Ashen Predator's Scaleform
        'transmog:2866',
        'transmog:2889',
        'transmog:2890',
        'transmog:2891',
        // Mage - Underlight Conjurer's Brilliance
        'transmog:2865',
        'transmog:2907',
        'transmog:2908',
        'transmog:2909',
        // Monk - Fangs of the Vermillion Forge
        'transmog:2864',
        'transmog:2886',
        'transmog:2887',
        'transmog:2888',
        // Paladin - Heartfire Sentinel's Authority
        'transmog:2859',
        'transmog:2871',
        'transmog:2872',
        'transmog:2873',
        // Priest - The Furnace Seraph's Verdict
        'transmog:2863',
        'transmog:2883',
        'transmog:2884',
        'transmog:2885',
        // Rogue - Lurking Specter's Shadeweave
        'transmog:2862',
        'transmog:2880',
        'transmog:2881',
        'transmog:2882',
        // Shaman - Runes of the Cinderwolf
        'transmog:2861',
        'transmog:2877',
        'transmog:2878',
        'transmog:2879',
        // Warlock - Sinister Savant's Cursethreads
        'transmog:2860',
        'transmog:2874',
        'transmog:2875',
        'transmog:2876',
        // Warrior - Irons of the Onyx Crucible
        'transmog:2858',
        'transmog:2898',
        'transmog:2899',
        'transmog:2900',
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
