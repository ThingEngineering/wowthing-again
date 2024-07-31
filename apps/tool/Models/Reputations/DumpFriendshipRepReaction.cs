using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Reputations;

// ReSharper disable InconsistentNaming
public class DumpFriendshipRepReaction
{
    public int ID { get; set; }

    public int FriendshipRepID { get; set; }
    public int ReactionThreshold { get; set; }

    [Name("Reaction_lang")]
    public string Reaction { get; set; } = string.Empty;
}
