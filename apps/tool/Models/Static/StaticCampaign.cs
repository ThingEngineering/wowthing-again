using Wowthing.Lib.Models.Wow;
using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticCampaignConverter))]
public class StaticCampaign : WowCampaign
{
    public string Name { get; set; }

    public StaticCampaign(WowCampaign campaign) : base(campaign.Id)
    {
        Id = campaign.Id;
        QuestLineIds = campaign.QuestLineIds;
    }
}
