using Wowthing.Web.Converters;

namespace Wowthing.Web.Models;

[JsonConverter(typeof(UserHistoryGoldConverter))]
public class UserHistoryGold
{
    public DateTime Time { get; set; }
    public UserHistoryGoldEntry[] Entries { get; set; }
}

public class UserHistoryGoldEntry
{
    public int AccountId { get; set; }
    public int RealmId { get; set; }
    public int Gold { get; set; }
}
