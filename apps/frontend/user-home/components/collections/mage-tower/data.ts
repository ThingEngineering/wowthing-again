import { PlayableClass } from '@/enums/playable-class';

export enum MageTowerChallenge {
    None,
    Xylem, // Closing the Eye
    Agatha, // An Impossible Foe
    Sigryn, // The God-Queen's Fury
    Tugar, // Feltotem's Fall
    Kruul, // The Highlord's Return
    Erdris, // End of the Risen Threat
    Raest, // Thwarting the Twins
}
export const mageTowerChallengeOrder = [
    MageTowerChallenge.Xylem,
    MageTowerChallenge.Agatha,
    MageTowerChallenge.Sigryn,
    MageTowerChallenge.Tugar,
    MageTowerChallenge.Kruul,
    MageTowerChallenge.Erdris,
    MageTowerChallenge.Raest,
];

export const mageTowerByClass: Record<number, number[]> = {
    [PlayableClass.DeathKnight]: [
        MageTowerChallenge.Kruul, // Blood
        MageTowerChallenge.Xylem, // Frost
        MageTowerChallenge.Agatha, // Unholy
    ],
    [PlayableClass.DemonHunter]: [
        MageTowerChallenge.None, // Devourer
        MageTowerChallenge.Xylem, // Havoc
        MageTowerChallenge.Kruul, // Vengeance
    ],
    [PlayableClass.Druid]: [
        MageTowerChallenge.Raest, // Balance
        MageTowerChallenge.Agatha, // Feral
        MageTowerChallenge.Kruul, // Guardian
        MageTowerChallenge.Erdris, // Restoration
    ],
    [PlayableClass.Hunter]: [
        MageTowerChallenge.Tugar, // Beast Mastery
        MageTowerChallenge.Raest, // Marksmanship
        MageTowerChallenge.Xylem, // Survival
    ],
    [PlayableClass.Mage]: [
        MageTowerChallenge.Sigryn, // Arcane
        MageTowerChallenge.Agatha, // Fire
        MageTowerChallenge.Raest, // Frost
    ],
    [PlayableClass.Monk]: [
        MageTowerChallenge.Kruul, // Brewmaster
        MageTowerChallenge.Erdris, // Mistweaver
        MageTowerChallenge.Tugar, // Windwalker
    ],
    [PlayableClass.Paladin]: [
        MageTowerChallenge.Erdris, // Holy
        MageTowerChallenge.Kruul, // Protection
        MageTowerChallenge.Sigryn, // Retribution
    ],
    [PlayableClass.Priest]: [
        MageTowerChallenge.Tugar, // Discipline
        MageTowerChallenge.Erdris, // Holy
        MageTowerChallenge.Raest, // Shadow
    ],
    [PlayableClass.Rogue]: [
        MageTowerChallenge.Sigryn, // Assassination
        MageTowerChallenge.Agatha, // Outlaw
        MageTowerChallenge.Xylem, // Subtlety
    ],
    [PlayableClass.Shaman]: [
        MageTowerChallenge.Agatha, // Elemental
        MageTowerChallenge.Sigryn, // Enhancement
        MageTowerChallenge.Erdris, // Restoration
    ],
    [PlayableClass.Warlock]: [
        MageTowerChallenge.Raest, // Affliction
        MageTowerChallenge.Sigryn, // Demonology
        MageTowerChallenge.Tugar, // Destruction
    ],
    [PlayableClass.Warrior]: [
        MageTowerChallenge.Xylem, // Arms
        MageTowerChallenge.Agatha, // Fury
        MageTowerChallenge.Kruul, // Protection
    ],
};
