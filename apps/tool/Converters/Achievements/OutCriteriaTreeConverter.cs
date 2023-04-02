using Wowthing.Tool.Models.Achievements;

namespace Wowthing.Tool.Converters.Achievements;

public class OutCriteriaTreeConverter: JsonConverter<OutCriteriaTree>
{
    public override OutCriteriaTree Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutCriteriaTree criteriaTree, JsonSerializerOptions options)
    {
     writer.WriteStartArray();

     writer.WriteNumberValue(criteriaTree.Id);
     writer.WriteNumberValue(criteriaTree.Amount);
     writer.WriteNumberValue(criteriaTree.CriteriaId);
     writer.WriteNumberValue(criteriaTree.Flags);
     writer.WriteNumberValue(criteriaTree.Operator);
     writer.WriteStringValue(criteriaTree.Description);

     writer.WriteStartArray();
     foreach (int childId in criteriaTree.Children)
     {
         writer.WriteNumberValue(childId);
     }
     writer.WriteEndArray();

     writer.WriteEndArray();
    }
}
