export enum AchievementFlags {
    Counter                     = 0x000001, // 1
    Hidden                      = 0x000002, // 2
    PlayNoVisual                = 0x000004, // 4
    Sum                         = 0x000008, // 8
    MaxUsed                     = 0x000010, // 16
    ReqCount                    = 0x000020, // 32
    Average                     = 0x000040, // 64
    ProgressBar                 = 0x000080, // 128
    RealmFirstReach             = 0x000100, // 256
    RealmFirstKill              = 0x000200, // 512
    Unk11                       = 0x000400, // 1024
    HideIncomplete              = 0x000800, // 2048
    ShowInGuildNews             = 0x001000, // 4096
    ShowInGuildHeader           = 0x002000, // 8192
    Guild                       = 0x004000, // 16384
    ShowGuildMembers            = 0x008000, // 32768
    ShowCriteriaMembers         = 0x010000, // 65536
    AccountWide                 = 0x020000, // 131072
    Unk19                       = 0x040000, // 262144
    HideZeroCounter             = 0x080000, // 524288
    Tracking                    = 0x100000, // 1048576
}

export enum CriteriaTreeFlags {
    ProgressBar                 = 0x0001, // 1
    DoNotDisplay                = 0x0002, // 2
    IsDate                      = 0x0004, // 4
    IsMoney                     = 0x0008, // 8
    ToastOnComplete             = 0x0010, // 16
    UseObjectsDescription       = 0x0020, // 32
    ShowFactionSpecificChild    = 0x0040, // 64
    DisplayAllChildren          = 0x0080, // 128
    AwardBonusRep               = 0x0100, // 256
    AllianceOnly                = 0x0200, // 512
    HordeOnly                   = 0x0400, // 1024
    DisplayAsFraction           = 0x0800, // 2048
    IsForQuest                  = 0x1000, // 4096
}

export enum CriteriaTreeOperator {
    Single = 0,
    SingleNotCompleted = 1,
    All = 4,
    SumChildren = 5,
    MaxChild = 6,
    CountDirectChildren = 7,
    Any = 8,
    SumChildrenWeight = 9,
}

export enum TransmogSetFlags {
    NotInTransmogSetUi          = 0x01, // 1
    HiddenUntilCollected        = 0x02, // 2
    AllianceOnly                = 0x04, // 4
    HordeOnly                   = 0x08, // 8
    PvpSet                      = 0x10, // 16
}

export enum TransmogSetItemFlags {
    PrimaryInSlot               = 0x1, // 1
    AutoFillSource              = 0x2, // 2
}

export enum TransmogSource {
    Unknown                     = 0,
    DungeonJournalEncounter     = 1,
    Quest                       = 2,
    Vendor                      = 3,
    WorldDrop                   = 4,
    HiddenUntilCollected        = 5,
    CantCollect                 = 6,
    Achievement                 = 7,
    Profession                  = 8,
    NotValidForTransmog         = 9,
}
