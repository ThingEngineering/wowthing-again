import { Profession } from '@/enums/profession';
import type { ProfessionCooldownQuest, ProfessionCooldownSpell } from '@/types';

export const professionCooldowns: (ProfessionCooldownQuest | ProfessionCooldownSpell)[] = [
    // Alchemy
    {
        type: 'spell',
        key: 'dfTransmute',
        name: '[DF] Transmute',
        profession: Profession.Alchemy,
        cooldown: [
            [86400], // 24h
            [60480, 2823, 19538, 21], // 16h48m @ 20 points in Transmutation
        ],
    },
    {
        type: 'spell',
        key: 'wodAlchemySecrets',
        name: '[WoD] Secrets',
        profession: Profession.Alchemy,
        cooldown: [[0]],
    },

    // Blacksmithing
    {
        type: 'spell',
        key: 'wodBlacksmithingSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Blacksmithing,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'wodBlacksmithingTruesteel',
        name: '[WoD] Truesteel',
        profession: Profession.Blacksmithing,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopBlacksmithingTrillium',
        name: '[MoP] Balanced Trillium',
        profession: Profession.Blacksmithing,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopBlacksmithingLightning',
        name: '[MoP] Lightning Steel',
        profession: Profession.Blacksmithing,
        cooldown: [[0]],
    },

    // Enchanting
    {
        type: 'spell',
        key: 'wodEnchantingSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Enchanting,
        cooldown: [[0]],
    },

    // Engineering
    {
        type: 'spell',
        key: 'dfSuspiciouslySilent',
        name: '[DF] Suspiciously Silent',
        profession: Profession.Engineering,
        cooldown: [
            [72000], // 20h
        ],
    },
    {
        type: 'spell',
        key: 'dfSuspiciouslyTicking',
        name: '[DF] Suspiciously Ticking',
        profession: Profession.Engineering,
        cooldown: [
            [72000], // 20h
        ],
    },
    {
        type: 'spell',
        key: 'wodEngineeringSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Engineering,
        cooldown: [[0]],
    },

    // Inscription
    {
        type: 'spell',
        key: 'wodInscriptionSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Inscription,
        cooldown: [[0]],
    },

    // Jewelcrafting
    {
        type: 'spell',
        key: 'dfJeweledDragonsHeart',
        name: "[DF] Jeweled Dragon's Heart",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'dfDreamersVision',
        name: "[DF] Dreamer's Vision",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'dfEarthwardensPrize',
        name: "[DF] Earthwarden's Prize",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'dfKeepersGlory',
        name: "[DF] Keeper's Glory",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'dfQueensGift',
        name: "[DF] Queen's Gift",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'dfTimewatchersPatience',
        name: "[DF] Timewatcher's Patience",
        profession: Profession.Jewelcrafting,
        cooldown: [
            [72000], // 20h
            [36000, 2829, 28607, 11], // 10h @ 10 points in Glasware
        ],
    },
    {
        type: 'spell',
        key: 'wodJewelcraftingSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Jewelcrafting,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopJewelcraftingResearch',
        name: '[MoP] Research',
        profession: Profession.Jewelcrafting,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopJewelcraftingSerpents',
        name: "[MoP] Serpent's Heart",
        profession: Profession.Jewelcrafting,
        cooldown: [[0]],
    },

    // Leatherworking
    {
        type: 'spell',
        key: 'wodLeatherworkingSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Leatherworking,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopLeatherworkingHardened',
        name: '[MoP] Hardened',
        profession: Profession.Leatherworking,
        cooldown: [[0]],
    },
    {
        type: 'spell',
        key: 'mopLeatherworkingMagnificence',
        name: '[MoP] Magnificence',
        profession: Profession.Leatherworking,
        cooldown: [[0]],
    },

    // Skinning
    {
        type: 'quest',
        key: 'dfProfessionSkinningMagmaCobra',
        name: 'Magma Cobra',
        profession: Profession.Skinning,
        ids: [74235],
    },
    {
        type: 'quest',
        key: 'dfProfessionSkinningVerdantGladewarden',
        name: 'Verdant Gladewarden',
        profession: Profession.Skinning,
        ids: [78397],
    },

    // Tailoring
    {
        type: 'spell',
        key: 'dfAzureweave',
        name: '[DF] Azureweave',
        profession: Profession.Tailoring,
        cooldown: [
            [60480], // 16h48m
            [43200, 2831, 40072, 1], // 12h @ unlocked Azureweaving
            [30240, 2831, 40072, 21], // 8h24m @ 20 points in Azureweaving
        ],
    },
    {
        type: 'spell',
        key: 'dfChronocloth',
        name: '[DF] Chronocloth',
        profession: Profession.Tailoring,
        cooldown: [
            [60480], // 16h48m
            [43200, 2831, 40070, 1], // 12h @ unlocked Timeweaving
            [30240, 2831, 40070, 21], // 8h24m @ 20 points in Timeweaving
        ],
    },
    {
        type: 'spell',
        key: 'wodTailoringingSecrets',
        name: '[WoD] Secrets',
        profession: Profession.Tailoring,
        cooldown: [[0]],
    },
];

export const professionWorkOrders: ProfessionCooldownSpell[] = [
    // Alchemy
    {
        type: 'spell',
        key: 'orders171',
        name: '[DF] Work Orders',
        profession: Profession.Alchemy,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Blacksmithing
    {
        type: 'spell',
        key: 'orders164',
        name: '[DF] Work Orders',
        profession: Profession.Blacksmithing,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Enchanting
    {
        type: 'spell',
        key: 'orders333',
        name: '[DF] Work Orders',
        profession: Profession.Enchanting,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Engineering
    {
        type: 'spell',
        key: 'orders202',
        name: '[DF] Work Orders',
        profession: Profession.Engineering,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Inscription
    {
        type: 'spell',
        key: 'orders773',
        name: '[DF] Work Orders',
        profession: Profession.Inscription,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Jewelcrafting
    {
        type: 'spell',
        key: 'orders755',
        name: '[DF] Work Orders',
        profession: Profession.Jewelcrafting,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Leatherworking
    {
        type: 'spell',
        key: 'orders165',
        name: '[DF] Work Orders',
        profession: Profession.Leatherworking,
        cooldown: [
            [86400], // 24h
        ],
    },

    // Tailoring
    {
        type: 'spell',
        key: 'orders197',
        name: '[DF] Work Orders',
        profession: Profession.Tailoring,
        cooldown: [
            [86400], // 24h
        ],
    },
];
