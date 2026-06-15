using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;

namespace Wowthing.Web.Models.Api;

public class ApiDynamicData
{
    public WowRegion Region { get; set; }
    public object[] Delves { get; set; }
    public Dictionary<int, WorldQuestAggregate[]> WorldQuests { get; set; }
}
