namespace Wowthing.Lib.Enums
{
    public enum FarmType
    {
        Kill = 1,
        KillBig,
        Puzzle,
        Treasure,
        Event,
        EventBig,
        Cloth,
        Leather,
        Mail,
        Plate,
        Weapon,
        Vendor,
        Group,
        Quest,
    }

    public enum FarmIdType
    {
        Npc = 1,
        Object,
        Quest,
    }

    public enum FarmResetType
    {
        None,
        Daily,
        BiWeekly,
        Weekly,
        Never,
        Monthly,
    }

    public enum RewardReputation
    {
        Friendly = 1,
        Honored = 2,
        Revered = 3,
        Exalted = 4,
    }

    public enum RewardType
    {
        Pet = 1,
        Mount,
        Quest,
        Toy,
        Cosmetic,
        Armor,
        Weapon,
        Achievement,
        Item,
        Transmog = 100,
    }
}
