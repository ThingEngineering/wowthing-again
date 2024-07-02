namespace Wowthing.Lib.Enums;

public enum WowInventorySlot
{
    Ammo = 0,
    Head = 1,
    Neck = 2,
    Shoulders = 3,
    Shirt = 4,
    Chest = 5,
    Waist = 6,
    Legs = 7,
    Feet = 8,
    Wrist = 9,
    Hands = 10,
    Ring1 = 11,
    Ring2 = 12,
    Trinket1 = 13,
    Trinket2 = 14,
    Back = 15,
    MainHand = 16,
    OffHand = 17,
    Ranged = 18,
    Tabard = 19,

    Profession1Tool = 20,
    Profession1Gear1,
    Profession1Gear2,
    Profession2Tool,
    Profession2Gear1,
    Profession2Gear2,
    CookingTool,
    CookingGear1,
    FishingTool,
    FishingGear1,
    FishingGear2,

    Bag1 = 31,
    Bag2,
    Bag3,
    Bag4,

    // These slots need to match what the game calls them, can't just rename the existing members as it
    // breaks stored data
    Shoulder = 3,
    Finger1 = 11,
    Finger2 = 12,
}
