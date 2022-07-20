namespace Wowthing.Lib.Enums;

[Flags]
public enum WowTransmogSetFlags
{
    NotInTransmogSetUi          = 0x01, // 1
    HiddenUntilCollected        = 0x02, // 2
    AllianceOnly                = 0x04, // 4
    HordeOnly                   = 0x08, // 8
    PvpSet                      = 0x10, // 16
}