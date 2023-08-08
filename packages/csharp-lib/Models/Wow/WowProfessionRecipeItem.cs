using System.ComponentModel.DataAnnotations;

namespace Wowthing.Lib.Models.Wow;

public class WowProfessionRecipeItem
{
    public int SkillLineAbilityId { get; set; }
    public int SkillLineId { get; set; }
    public int ItemId { get; set; }
}
