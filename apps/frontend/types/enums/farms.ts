export enum FarmType
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
    Dungeon,
    Raid,
}

export enum RewardType {
    Pet = 1,
    Mount,
    Quest,
    Toy,
    Cosmetic,
    Armor,
    Weapon,
    Achievement,
    Item,
    Illusion,
    Transmog = 100,
    InstanceSpecial = 1000,
    SetSpecial = 1001,
}

export enum FarmIdType
{
    Npc = 1,
    Object,
    Quest,
    Instance,
}

export enum FarmResetType
{
    None,
    Daily,
    BiWeekly,
    Weekly,
    Never,
    Monthly,
}
