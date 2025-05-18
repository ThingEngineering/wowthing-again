using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerGuild
{
    public int Id { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    public int RealmId { get; set; }
    public string Name { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerGuildTab> Tabs { get; set; }

    // Navigation properties
    public List<PlayerGuildItem> Items { get; set; }
}

public class PlayerGuildTab
{
    public int Id { get; set; }
    public string Icon { get; set; }
    public string Name { get; set; }
}
