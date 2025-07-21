import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

// BASE MOVEMENT SPEED! spellId is only required for choice nodes
//
// Talent node ID -> [spellId, ...movement speeds per rank]
export const moveSpeedTalents = getNumberKeyedEntries({
    // Death Knight (none?)

    // Demon Hunter
    // 90940: [0, ???], // Pursuit - scales with mastery, add custom support :|

    // Druid
    82236: [0, 15], // Feline Swiftness

    // Evoker
    93299: [0, 10], // Exuberance - above 75% health

    // Hunter
    102400: [0, 30], // Trailblazer - out of combat
    102404: [0, 4], // Pathfinding
    103986: [474440, 4], // Cunning - buffs Pathfinding to 8%

    // Mage (none?)

    // Monk
    101160: [0, 15], // Jade Walk - out of combat
    101170: [0, 5], // Flow of Chi - above 90% health
    101175: [0, 4], // Windwalking

    // Paladin
    81630: [0, 2], // Obduracy
    103867: [0, 3], // Lead the Charge

    // Priest (none?)

    // Rogue
    90673: [0, 15], // Hit and Run [Outlaw]
    90687: [0, 20], // Shadowrunner - while stealthed
    90762: [0, 15], // Fleet Footed

    // Shaman (none? all buff Ghost Wolf)

    // Warlock (none?)

    // Warrior
    90373: [0, 2, 4], // Dual Wield Specialization
    // 90398: [383848, 10], // Frenzied Enrage [Fury] - enraged only
    // 90400: [0, 5], // Single-Minded Fury [Fury] - one-handed weapons only
});
