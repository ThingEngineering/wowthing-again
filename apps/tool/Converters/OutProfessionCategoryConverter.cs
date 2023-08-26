using Wowthing.Tool.Models.Professions;

namespace Wowthing.Tool.Converters;

public class OutProfessionCategoryConverter : JsonConverter<OutProfessionCategory>
{
    public override OutProfessionCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutProfessionCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(category.Id);
        writer.WriteNumberValue(category.Order);
        writer.WriteStringValue(category.Name);

        // Children
        writer.WriteStartArray();
        foreach (var child in category.Children.EmptyIfNull())
        {
            Write(writer, child, options);
        }
        writer.WriteEndArray();

        // Abilities
        writer.WriteStartArray();
        foreach (var ability in category.Abilities.EmptyIfNull())
        {
            writer.WriteStartArray();

            writer.WriteNumberValue(ability.Id);
            writer.WriteNumberValue(ability.SpellId);
            writer.WriteNumberValue(ability.ItemId);
            writer.WriteNumberValue(ability.FirstCraftQuestId);
            writer.WriteNumberValue(ability.Skillups);
            writer.WriteNumberValue(ability.Min);
            writer.WriteNumberValue(ability.TrivialLow);
            writer.WriteNumberValue(ability.TrivialHigh);
            writer.WriteNumberValue(ability.Faction);
            writer.WriteStringValue(ability.Name);

            if (ability.Ranks != null)
            {
                writer.WriteStartArray();

                for (int i = 0; i < ability.Ranks.Count; i += 2)
                {
                    writer.WriteStartArray();
                    writer.WriteNumberValue(ability.Ranks[i]);
                    writer.WriteNumberValue(ability.Ranks[i + 1]);
                    writer.WriteEndArray();
                }

                writer.WriteEndArray();
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
