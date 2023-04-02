using Wowthing.Tool.Models.Achievements;

namespace Wowthing.Tool.Converters.Achievements;

public class OutAchievementConverter : JsonConverter<OutAchievement>
{
    public override OutAchievement Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutAchievement achievement, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(achievement.Id);
        writer.WriteNumberValue(achievement.CategoryId);
        writer.WriteNumberValue(achievement.CriteriaTreeId);
        writer.WriteNumberValue(achievement.Faction);
        writer.WriteNumberValue((int)achievement.Flags);
        writer.WriteNumberValue(achievement.MinimumCriteria);
        writer.WriteNumberValue(achievement.Order);
        writer.WriteNumberValue(achievement.Points);
        writer.WriteNumberValue(achievement.SupersededBy);
        writer.WriteNumberValue(achievement.Supersedes);
        writer.WriteStringValue(achievement.Description);
        writer.WriteStringValue(achievement.Name);
        writer.WriteStringValue(achievement.Reward);
        writer.WriteEndArray();
    }
}
