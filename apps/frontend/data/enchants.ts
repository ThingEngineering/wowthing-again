import { InventorySlot } from '@/enums/inventory-slot';
import type { Character } from '@/types/character';

// SpellItemEnchantment.db2
export const validEnchants: Record<number, number[]> = {
    [InventorySlot.MainHand]: [
        3368, // Rune of the Fallen Crusader [DK]
        5870, // Rune of the Fallen Crusader [DK]
        // 6243, // Rune of Hysteria [DK]
        3370, // Rune of Razorice [DK]
        5869, // Rune of Razorice [DK]
        6241, // Rune of Sanguination [DK]
        3847, // Rune of the Stoneskin Gargoyle [DK]

        8038, // Acuity of the Ren'dorei 1
        8039, // Acuity of the Ren'dorei 2
        8040, // Arcane Mastery 1
        8041, // Arcane Mastery 2
        7982, // Berserker's Rage 1
        7983, // Berserker's Rage 2
        8036, // Flames of the Sin'dorei 1
        8037, // Flames of the Sin'dorei 2
        7980, // Jan'alai's Precision 1
        7981, // Jan'alai's Precision 2
        7978, // Strength of Halazzi 1
        7979, // Strength of Halazzi 2
        8010, // Worldsoul Aegis 1
        8009, // Worldsoul Aegis 2
        8008, // Worldsoul Cradle 1
        8007, // Worldsoul Cradle 2
        8010, // Worldsoul Tenacity 1
        8011, // Worldsoul Tenacity 2
    ],

    [InventorySlot.Head]: [
        7990, // Empowered Blessing of Speed 1
        7991, // Empowered Blessing of Speed 1
        7960, // Empowered Hex of Leeching 1
        7961, // Empowered Hex of Leeching 1
        8016, // Empowered Rune of Avoidance 1
        8017, // Empowered Rune of Avoidance 1
    ],

    [InventorySlot.Shoulders]: [
        7972, // Akil'zon's Swiftness 1
        7973, // Akil'zon's Swiftness 2
        8000, // Amirdrassil's Grace 1
        8001, // Amirdrassil's Grace 2
        8030, // Silvermoon's Mending 1
        8031, // Silvermoon's Mending 2
    ],

    [InventorySlot.Chest]: [
        7956, // Mark of Nalorakk 1
        7957, // Mark of Nalorakk 2
        8012, // Mark of the Magister 1
        8013, // Mark of the Magister 2
        7984, // Mark of the Rootwarden 1
        7985, // Mark of the Rootwarden 2
        7986, // Mark of the Worldsoul 1
        7987, // Mark of the Worldsoul 2
    ],

    [InventorySlot.Legs]: [
        7936, // Arcanoweave Spellthread 1
        7937, // Arcanoweave Spellthread 2
        8162, // Blood Knight's Armor Kit 1
        8163, // Blood Knight's Armor Kit 2
        8158, // Forest Hunter's Armor Kit 1
        8159, // Forest Hunter's Armor Kit 2
        7934, // Sunfire Silk Spellthread 1
        7935, // Sunfire Silk Spellthread 2
    ],

    [InventorySlot.Feet]: [
        8018, // Farstrider's Hunt 1
        8019, // Farstrider's Hunt 2
        7962, // Lynx's Dexterity 1
        7963, // Lynx's Dexterity 2
        7992, // Shaladrassil's Roots 1
        7993, // Shaladrassil's Roots 2
    ],

    [InventorySlot.Ring1]: [
        7966, // Eyes of the Eagle 1
        7967, // Eyes of the Eagle 2
        7996, // Nature's Fury 1
        7997, // Nature's Fury 2
        8024, // Silvermoon's Alacrity 1
        8025, // Silvermoon's Alacrity 2
        8026, // Silvermoon's Tenacity 1
        8027, // Silvermoon's Tenacity 2
        7968, // Zul'jin's Mastery 1
        7969, // Zul'jin's Mastery 2
    ],
};

export const specialValidEnchants: Record<number, SpecialValidEnchant> = {
    // FIXME
    /*[InventorySlot.Hands]: {
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
    },*/
};

interface SpecialValidEnchant {
    enchants: number[];
    checkFunc: (character: Character) => boolean;
}
