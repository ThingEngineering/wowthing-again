using Wowthing.Tool.Models.Professions;
using Wowthing.Tool.Models.Traits;

namespace Wowthing.Tool.Converters.Professions;

public class OutProfessionConverter : JsonConverter<OutProfession>
{
    public override OutProfession? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutProfession profession, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(profession.Id);
        writer.WriteNumberValue(profession.Type);
        writer.WriteStringValue(profession.Name);
        writer.WriteStringValue(profession.Slug);

        writer.WriteStartArray();
        foreach (var category in profession.Categories.EmptyIfNull())
        {
            WriteCategory(writer, category, options);
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var subProfession in profession.SubProfessions.EmptyIfNull())
        {
            WriteSubProfession(writer, subProfession, options);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteCategory(Utf8JsonWriter writer, OutProfessionCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(category.Id);
        writer.WriteNumberValue(category.Order);
        writer.WriteStringValue(category.Name);

        // Children
        writer.WriteStartArray();
        foreach (var child in category.Children.EmptyIfNull())
        {
            WriteCategory(writer, child, options);
        }
        writer.WriteEndArray();

        // Abilities
        writer.WriteStartArray();
        foreach (var ability in category.Abilities.EmptyIfNull())
        {
            writer.WriteStartArray();

            writer.WriteNumberValue(ability.Id);
            writer.WriteNumberValue(ability.SpellId);

            if (ability.ItemId2 > 0)
            {
                writer.WriteStartArray();
                writer.WriteNumberValue(ability.ItemId);
                writer.WriteNumberValue(ability.ItemId2);
                writer.WriteEndArray();
            }
            else
            {
                writer.WriteNumberValue(ability.ItemId);
            }

            writer.WriteNumberValue(ability.FirstCraftQuestId);
            writer.WriteNumberValue(ability.Skillups);
            writer.WriteNumberValue(ability.Min);
            writer.WriteNumberValue(ability.TrivialLow);
            writer.WriteNumberValue(ability.TrivialHigh);
            writer.WriteNumberValue(ability.Faction);
            writer.WriteNumberValue(ability.Source);
            writer.WriteStringValue(ability.Name);

            if (ability.Reagents != null)
            {
                writer.WriteStartArray();
                foreach (var reagent in ability.Reagents.CategoryReagents)
                {
                    writer.WriteStartArray();
                    writer.WriteNumberValue(reagent.Count);
                    writer.WriteNumberArray(reagent.CategoryIds.Select(n => (int)n));
                    writer.WriteEndArray();
                }
                writer.WriteEndArray();

                writer.WriteStartArray();
                foreach ((int count, int itemId) in ability.Reagents.ItemReagents)
                {
                    writer.WriteStartArray();
                    writer.WriteNumberValue(count);
                    writer.WriteNumberValue(itemId);
                    writer.WriteEndArray();
                }
                writer.WriteEndArray();
            }
            else
            {
                writer.WriteStartArray();
                writer.WriteEndArray();

                writer.WriteStartArray();
                writer.WriteEndArray();
            }

            writer.WriteStartArray();
            if (ability.Ranks != null)
            {
                for (int i = 0; i < ability.Ranks.Count; i += 2)
                {
                    writer.WriteStartArray();
                    writer.WriteNumberValue(ability.Ranks[i]);
                    writer.WriteNumberValue(ability.Ranks[i + 1]);
                    writer.WriteEndArray();
                }
            }
            writer.WriteEndArray();

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteSubProfession(Utf8JsonWriter writer, OutSubProfession subProfession, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(subProfession.Id);
        writer.WriteStringValue(subProfession.Name);

        writer.WriteStartArray();
        foreach (var traitTree in subProfession.TraitTrees.EmptyIfNull())
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(traitTree.Id);
            WriteTraitNode(writer, traitTree.FirstNode, options);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteTraitNode(Utf8JsonWriter writer, OutTraitNode node, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(node.NodeId);
        writer.WriteNumberValue(node.RankEntryId);
        writer.WriteNumberValue(node.RankMax);
        writer.WriteNumberValue(node.UnlockEntryId);
        writer.WriteStringValue(node.Name);

        writer.WriteStartArray();
        foreach (var perk in node.Perks.EmptyIfNull())
        {
            WritePerk(writer, perk, options);
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var child in node.Children.EmptyIfNull())
        {
            WriteTraitNode(writer, child, options);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WritePerk(Utf8JsonWriter writer, OutTraitPerk perk, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(perk.NodeId);
        writer.WriteNumberValue(perk.SpentPoints);
        writer.WriteStringValue(perk.Description);

        writer.WriteEndArray();
    }
}
