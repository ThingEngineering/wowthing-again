import { InventoryType } from '@/enums/inventory-type'


export type TierData = {
    sets: {
        [k: string]: boolean
    }
    slots: InventoryType[]
}

export const currentTier: TierData = {
    sets: Object.fromEntries([
        // Death Knight - Risen Nightmare's Gravemantle
        'transmog:3161',
        'transmog:3162',
        'transmog:3163',
        'transmog:3164',
        // Demon Hunter - Screaming Torchfiend's Brutality
        'transmog:3153',
        'transmog:3154',
        'transmog:3155',
        'transmog:3156',
        // Druid - Benevolent Embersage's Guidance
        'transmog:3177',
        'transmog:3178',
        'transmog:3179',
        'transmog:3180',
        // Evoker - Werynkeeper's Timeless Vigil
        'transmog:3157',
        'transmog:3158',
        'transmog:3159',
        'transmog:3160',
        // Hunter - Blazing Dreamstalker's Trophies
        'transmog:3137',
        'transmog:3138',
        'transmog:3139',
        'transmog:3140',
        // Mage - Wayward Chronomancer's Clockwork
        'transmog:3185',
        'transmog:3186',
        'transmog:3187',
        'transmog:3188',
        // Monk - Mystic Heron's Discipline
        'transmog:3141',
        'transmog:3142',
        'transmog:3143',
        'transmog:3144',
        // Paladin - Zealous Pyreknight's Ardor
        'transmog:3145',
        'transmog:3146',
        'transmog:3147',
        'transmog:3148',
        // Priest - Blessings of Lunar Communion
        'transmog:3181',
        'transmog:3182',
        'transmog:3183',
        'transmog:3184',
        // Rogue - Lucid Shadewalker's Silence
        'transmog:3165',
        'transmog:3166',
        'transmog:3167',
        'transmog:3168',
        // Shaman - Vision of the Greatwolf Outcast
        'transmog:3169',
        'transmog:3170',
        'transmog:3171',
        'transmog:3172',
        // Warlock - Devout Ashdevil's Pactweave
        'transmog:3173',
        'transmog:3174',
        'transmog:3175',
        'transmog:3176',
        // Warrior - Molten Vanguard's Mortarplate
        'transmog:3149',
        'transmog:3150',
        'transmog:3151',
        'transmog:3152',
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
