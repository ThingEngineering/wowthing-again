using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiMissingProfessionRecipesForm
{
    public bool AllRealms { get; set; }
    public int CharacterId { get; set; }
    public int[] CharacterIds { get; set; }
    public bool IncludeRussia { get; set; }
    public int ProfessionId { get; set; }
    public WowRegion Region { get; set; }
}
