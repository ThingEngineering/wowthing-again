namespace Wowthing.Tool.Models.Db;

public class OutDbThingLocation
{
    public int MapId { get; set; }
    public int PackedLocation { get; set; }

    public OutDbThingLocation(int mapId, string locationString)
    {
        MapId = mapId;

        // Convert x/y locations (eg 12.34 56.78) to an 8-digit integer (eg 12345678)
        decimal[] parts = locationString
            .Split()
            .Select(decimal.Parse)
            .ToArray();
        PackedLocation = (int)(parts[0] * 100 * 10000) + (int)(parts[1] * 100);
    }
}
