namespace Wowthing.Tool.Models.Db;

using System.Globalization;

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
            .Select(s => decimal.Parse(s, CultureInfo.InvariantCulture))
            .ToArray();
        PackedLocation = (int)(parts[0] * 100 * 10000) + (int)(parts[1] * 100);
    }
}
