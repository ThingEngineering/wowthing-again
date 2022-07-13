using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data;
using Wowthing.Backend.Models.Data.Achievements;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Converters;

public class DataReputationCategoryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (DataReputationCategory) value;
        var arr = new JArray();
        arr.Add(category.Name);
        arr.Add(category.Slug);

        var setsArr = new JArray();
        foreach (var reputationSet in category.Reputations)
        {
            var setArr = new JArray();

            foreach (var reputation in reputationSet)
            {
                var repArr = new JArray();
                repArr.Add(reputation.Paragon);

                var repsArr = new JArray();
                if (reputation.Both != null)
                {
                    repsArr.Add(GetReputationArray("both", reputation.Both));
                }

                if (reputation.Alliance != null)
                {
                    repsArr.Add(GetReputationArray("alliance", reputation.Alliance));
                }

                if (reputation.Horde != null)
                {
                    repsArr.Add(GetReputationArray("horde", reputation.Horde));
                }

                repArr.Add(repsArr);
                setArr.Add(repArr);
            }

            setsArr.Add(setArr);
        }
        arr.Add(setsArr);

        if (category.MinimumLevel.HasValue)
        {
            arr.Add(category.MinimumLevel.Value);
        }

        arr.WriteTo(writer);
    }

    private JArray GetReputationArray(string key, DataReputation rep)
    {
        var ret = new JArray();
        ret.Add(key);
        ret.Add(rep.Id);
        ret.Add(rep.Icon);

        var rewardsArr = new JArray();
        foreach (var reward in rep.Rewards.EmptyIfNull())
        {
            var rewardArr = new JArray();
            rewardArr.Add(Enum.Parse<RewardType>(reward.Type, true));
            rewardArr.Add(reward.Id);
            rewardsArr.Add(rewardArr);
        }
        ret.Add(rewardsArr);

        if (rep.Note != null)
        {
            ret.Add(rep.Note);
        }

        return ret;
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(DataReputationCategory) == objectType;
    }

    public override bool CanRead => false;

}
