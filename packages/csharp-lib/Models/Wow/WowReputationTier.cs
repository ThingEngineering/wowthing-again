using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Wow;

public class WowReputationTier
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Id { get; set; }

    public int[] MinValues { get; set; }

    public WowReputationTier(int id)
    {
        Id = id;
    }
}
