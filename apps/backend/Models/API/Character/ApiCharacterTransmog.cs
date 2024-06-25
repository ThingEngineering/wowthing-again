﻿namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterTransmog
{
    public List<ApiCharacterTransmogSlot> Slots { get; set; }
}

public class ApiCharacterTransmogSlot
{
    public List<ApiCharacterTransmogAppearance> Appearances { get; set; }
}

public class ApiCharacterTransmogAppearance
{
    public int Id { get; set; }
}
