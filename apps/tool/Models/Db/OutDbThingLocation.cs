using System.Globalization;

namespace Wowthing.Tool.Models.Db;

public class OutDbThingLocation
{
    public int MapId { get; set; }
    public int PackedLocation { get; set; }

    public OutDbThingLocation(int mapId, string locationString)
    {
        MapId = mapId;

        // Convert x/y locations (eg 12.34 56.78) to an 8-digit integer (eg 12345678)
        string[] parts = locationString.Split();
        decimal[] coords = parts[..2]
            .Select(s => decimal.Parse(s, CultureInfo.InvariantCulture))
            .ToArray();
        PackedLocation = (int)(coords[0] * 100 * 10000) + (int)(coords[1] * 100);

        // Add alliance/horde flag
        if (parts.Length > 2 && parts[2] == "alliance")
        {
            PackedLocation += 100000000;
        }
        else if (parts.Length > 2 && parts[2] == "horde")
        {
            PackedLocation += 200000000;
        }
    }
}
