using Wowthing.Tool.Models.Vendors;

namespace Wowthing.Tool.Converters.Manual;

public class ManualSharedVendorConverter : JsonConverter<ManualSharedVendor>
{
    private static readonly int[] EmptyAppearances = { 0 };

    public override ManualSharedVendor Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualSharedVendor vendor, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(vendor.Id);
        writer.WriteStringValue(vendor.Name);

        writer.WriteStringArray(vendor.Tags.EmptyIfNull());

        // Locations
        writer.WriteStartObject();
        foreach (var (mapName, locations) in vendor.Locations)
        {
            writer.WritePropertyName(mapName);
            writer.WriteStartArray();
            foreach (var location in locations)
            {
                writer.WriteStringArray(location.Split(' '));
            }
            writer.WriteEndArray();
        }
        writer.WriteEndObject();

        // Items
        writer.WriteStartArray();
        foreach (var item in vendor.Sells)
        {
            WriteItemArray(writer, item);
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var set in vendor.Sets)
        {
            WriteSetArray(writer, set);
        }
        writer.WriteEndArray();

        bool useNote = !string.IsNullOrWhiteSpace(vendor.Note);
        bool useGroupId = vendor.ZoneMapsGroupId != null;

        if (useGroupId || useNote)
        {
            writer.WriteStringValue(vendor.Note);
        }

        if (useGroupId)
        {
            writer.WriteNumberValue(vendor.ZoneMapsGroupId!.Value);
        }

        writer.WriteEndArray();
    }

    public static void WriteSetArray(Utf8JsonWriter writer, ManualSharedVendorSet set)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(set.Name);
        writer.WriteNumberArray(set.Range);

        if (set.SkipTooltip || !string.IsNullOrWhiteSpace(set.SortKey))
        {
            writer.WriteStringValue(set.SortKey);
        }

        if (set.SkipTooltip)
        {
            writer.WriteBooleanValue(set.SkipTooltip);
        }

        writer.WriteEndArray();
    }

    public static void WriteItemArray(Utf8JsonWriter writer, ManualVendorItem item)
    {
        bool useCosts = item.Costs.EmptyIfNull().Count >= 0;
        bool useReputation = !string.IsNullOrWhiteSpace(item.Reputation);
        bool useAppearance = item.AppearanceIds != null;
        bool useNote = !string.IsNullOrWhiteSpace(item.Note);
        bool useBonusIds = item.BonusIds?.Length > 0;

        writer.WriteStartArray();

        writer.WriteNumberValue(item.Id);
        writer.WriteNumberValue((int)item.Type);
        writer.WriteNumberValue(item.SubType);
        writer.WriteNumberValue((int)item.Quality);
        writer.WriteNumberValue(item.ClassMask);

        if (useNote || useBonusIds || useAppearance || useReputation || useCosts)
        {
            writer.WriteStartArray();
            foreach (var (currency, amount) in item.Costs.EmptyIfNull().OrderBy(kvp => kvp.Key))
            {
                writer.WriteNumberArray(new[] { currency, amount });
            }
            writer.WriteEndArray();
        }

        if (useNote || useBonusIds || useAppearance || useReputation)
        {
            writer.WriteStartArray();
            if (!string.IsNullOrWhiteSpace(item.Reputation))
            {
                var parts = item.Reputation.Split();
                writer.WriteNumberValue(int.Parse(parts[0]));

                var repLevel = string.Join(
                    "",
                    parts[1].Split('-')
                        .Select(part => part[0].ToString().ToUpper() + part.Substring(1))
                );
                writer.WriteNumberValue((int)Enum.Parse<RewardReputation>(repLevel));
            }
            writer.WriteEndArray();
        }

        if (useNote || useBonusIds || useAppearance)
        {
            writer.WriteNumberArray(item.AppearanceIds ?? EmptyAppearances);
        }

        if (useNote || useBonusIds)
        {
            writer.WriteNumberArray(item.BonusIds.EmptyIfNull());
        }

        if (useNote)
        {
            writer.WriteStringValue(item.Note);
        }

        writer.WriteEndArray();
    }
}
