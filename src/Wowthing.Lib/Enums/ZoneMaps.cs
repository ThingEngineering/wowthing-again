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
    }

    public enum FarmIdType
    {
        Npc = 1,
        Object,
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
        Transmog = 100,
    }
}
