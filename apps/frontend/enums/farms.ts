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
    Profession,
    Achievement,
}

export enum FarmIdType
{
    Npc = 1,
    Object,
    Quest,
    Instance,
    Group,
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

export enum FarmAnchorPoint
{
    None,
    TopLeft,
    Top,
    TopRight,
    Left,
    Center,
    Right,
    BottomLeft,
    Bottom,
    BottomRight,
}
