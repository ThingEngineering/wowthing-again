using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Enums;

public enum WowWeaponSubclass
{
    [Display(Name = "One-handed Axe")]
    OneHandedAxe = 0,
    [Display(Name = "Two-handed Axe")]
    TwoHandedAxe = 1,
    Bow = 2,
    Gun = 3,
    [Display(Name = "One-handed Mace")]
    OneHandedMace = 4,
    [Display(Name = "Two-handed Mace")]
    TwoHandedMace = 5,
    Polearm = 6,
    [Display(Name = "One-handed Sword")]
    OneHandedSword = 7,
    [Display(Name = "Two-handed Sword")]
    TwoHandedSword = 8,
    Warglaive = 9,
    Stave = 10,
    //11: bear claws?
    //12: cat claws?
    Fist = 13,
    //14: misc?
    Dagger = 15,
    Thrown = 16,
    //17: spear?
    Crossbow = 18,
    Wand = 19,
    [Display(Name = "Fishing Pole")]
    FishingPole = 20,

    [Display(Name = "Off-hand")]
    OffHand = 30,
    Shield = 31,
}
