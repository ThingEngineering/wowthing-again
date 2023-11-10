using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticReputationCategoryConverter : JsonConverter<StaticReputationCategory>
{
    public override StaticReputationCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticReputationCategory value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteStringValue(value.Name);
        writer.WriteStringValue(value.Slug);

        // Sets
        writer.WriteStartArray();
        foreach (var reputationSet in value.Reputations)
        {
            // Set
            writer.WriteStartArray();

            foreach (var reputation in reputationSet)
            {
                // Reputation
                writer.WriteStartArray();
                writer.WriteBooleanValue(reputation.Paragon);

                // Reps
                writer.WriteStartArray();
                if (reputation.Both != null)
                {
                    WriteReputationArray(writer, "both", reputation.Both);
                }

                if (reputation.Alliance != null)
                {
                    WriteReputationArray(writer, "alliance", reputation.Alliance);
                }

                if (reputation.Horde != null)
                {
                    WriteReputationArray(writer, "horde", reputation.Horde);
                }

                writer.WriteEndArray();

                writer.WriteEndArray();
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        if (value.MinimumLevel.HasValue)
        {
            writer.WriteNumberValue(value.MinimumLevel.Value);
        }

        writer.WriteEndArray();
    }

    private void WriteReputationArray(Utf8JsonWriter writer, string key, StaticReputationCategoryReputation reputation)
    {
        writer.WriteStartArray();
        writer.WriteStringValue(key);
        writer.WriteNumberValue(reputation.Id);
        writer.WriteStringValue(reputation.Icon);

        // Start rewards
        writer.WriteStartArray();

        foreach (var reward in reputation.Rewards.EmptyIfNull())
        {
            // Start reward
            writer.WriteStartArray();
            writer.WriteNumberValue((int)Enum.Parse<RewardType>(reward.Type, true));
            writer.WriteNumberValue(reward.Id);
            writer.WriteEndArray();
            // End reward
        }

        writer.WriteEndArray();
        // End rewards

        if (!string.IsNullOrWhiteSpace(reputation.Note))
        {
            writer.WriteStringValue(reputation.Note);
        }

        writer.WriteEndArray();
    }
}
