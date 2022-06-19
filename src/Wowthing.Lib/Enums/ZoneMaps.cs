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
    }

    public enum FarmDropType
    {
        Pet = 1,
        Mount,
        Quest,
        Toy,
        Cosmetic,
        Armor,
        Weapon,
        Achievement,
        Transmog = 100,
    }
}
