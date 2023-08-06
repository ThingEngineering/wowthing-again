using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Api.User;

public class ApiUserCharacterShadowlands
{
    public int CovenantId { get; }
    public int RenownLevel { get; }
    public int SoulbindId { get; }

    public Dictionary<int, PlayerCharacterShadowlandsCovenant> Covenants { get; }
    public List<int[]> Conduits { get; }

    public ApiUserCharacterShadowlands(PlayerCharacterShadowlands shadowlands)
    {
        CovenantId = shadowlands.CovenantId;
        RenownLevel = shadowlands.RenownLevel;
        SoulbindId = shadowlands.SoulbindId;

        if (shadowlands.ConduitIds != null && shadowlands.ConduitRanks != null)
        {
            Conduits = shadowlands.ConduitIds.Zip(shadowlands.ConduitRanks)
                .Select(z => new[] { z.First, z.Second }).ToList();
        }
        else
        {
            Conduits = new();
        }

        Covenants = shadowlands.Covenants;
    }
}
