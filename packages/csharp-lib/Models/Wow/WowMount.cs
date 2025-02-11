using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowMount
{
    [Key]
    public int Id { get; set; }

    public int Flags { get; set; }
    public int SpellId { get; set; }
    public short SourceType { get; set; }
    public List<int> ItemIds { get; set; } = new();

    public WowMount(int id)
    {
        Id = id;
    }
}
